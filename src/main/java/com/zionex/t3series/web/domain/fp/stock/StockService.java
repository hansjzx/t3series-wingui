package com.zionex.t3series.web.domain.fp.stock;

import com.zionex.t3series.web.domain.fp.item.Inventory;
import com.zionex.t3series.web.domain.fp.item.InventoryRepository;
import com.zionex.t3series.web.domain.fp.order.SalesOrder;
import com.zionex.t3series.web.domain.fp.order.SalesOrderRepository;
import com.zionex.t3series.web.domain.fp.order.WorkOrder;
import com.zionex.t3series.web.domain.fp.order.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockService {

    private final StockRepository stockRepository;

    private final SoStockAssignRepository soStockAssignRepository;

    private final WoStockAssignRepository woStockAssignRepository;

    private final SalesOrderRepository salesOrderRepository;

    private final WorkOrderRepository workOrderRepository;

    private final InventoryRepository inventoryRepository;

    private static final String JOIN_DELIMITER = ", ";

    public List<Stock> getStocks() {
        return stockRepository.findAll();
    }

    public List<Stock> getStocksByStockCdAndDesc(String stockParam) {
        List <Stock> stocks = stockRepository.findByStockCdContainsOrDescTxtContains(stockParam, stockParam);
        Map<String, String> soStockAssignMap = soStockAssignRepository.findAll()
                .stream()
                .filter(SoStockAssign::getAssignYn)
                .collect(Collectors.groupingBy(SoStockAssign::getStockCd, Collectors.mapping(SoStockAssign::getSoCd, Collectors.joining(JOIN_DELIMITER))));
        Map<String, String> woStockAssignMap = woStockAssignRepository.findAll()
                .stream()
                .filter(WoStockAssign::getAssignYn)
                .collect(Collectors.groupingBy(WoStockAssign::getStockCd, Collectors.mapping(WoStockAssign::getWoCd, Collectors.joining(JOIN_DELIMITER))));

        for (Stock stock : stocks) {
            String soCds = soStockAssignMap.get(stock.getStockCd());
            String woCds = woStockAssignMap.get(stock.getStockCd());
            String delimiter = (StringUtils.isNotEmpty(woCds) && StringUtils.isNotEmpty(soCds)) ? JOIN_DELIMITER : "";
            String orderPeggingCd = StringUtils.joinWith(delimiter, soCds, woCds);
            stock.setOrderPeggingCd(orderPeggingCd);
        }

        return stocks;
    }

    public boolean saveStocks(List<Stock> stocks) {
        Map<String, Inventory> inventoryMap = inventoryRepository.findAll()
                .stream()
                .collect(Collectors.toMap(Inventory::getInventoryCd, Function.identity()));

        Map<String, String> stockMap = stockRepository.findAll()
                .stream()
                .collect(Collectors.toMap(Stock::getStockCd, Stock::getId));

       List<String> soCds = salesOrderRepository.findAll()
                .stream()
                .map(SalesOrder::getSoCd)
                .collect(Collectors.toList());

        List<String> woCds = workOrderRepository.findAll()
                .stream()
                .map(WorkOrder::getWoCd)
                .collect(Collectors.toList());

        Map<String, List<SoStockAssign>> soStockAssignMap = soStockAssignRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(SoStockAssign::getStockCd, LinkedHashMap::new, Collectors.toList()));

        Map<String, List<WoStockAssign>> woStockAssignMap = woStockAssignRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(WoStockAssign::getStockCd, LinkedHashMap::new, Collectors.toList()));

        List<SoStockAssign> deleteSoStockAssigns = new ArrayList<>();
        List<WoStockAssign> deleteWoStockAssigns = new ArrayList<>();
        List<SoStockAssign> saveSoStockAssigns = new ArrayList<>();
        List<WoStockAssign> saveWoStockAssigns = new ArrayList<>();

        for (Stock stock : stocks) {
            Inventory inventory = inventoryMap.get(stock.getInventoryCode());
            stock.setInventory(inventory);

            String stockCd = stock.getStockCd();
            if (stock.getId() == null || stock.getId().trim().isEmpty()) {
                stock.setId(stockMap.get(stockCd));
            }

            if (soStockAssignMap.containsKey(stockCd)) {
                deleteSoStockAssigns.addAll(soStockAssignMap.get(stockCd));
            }
            if (woStockAssignMap.containsKey(stockCd)) {
                deleteWoStockAssigns.addAll(woStockAssignMap.get(stockCd));
            }
            String orderPeggingCd = stock.getOrderPeggingCd();
            if (StringUtils.isNotBlank(orderPeggingCd)) {
                String[] orderPeggingCds = orderPeggingCd.split(",");
                for (String orderCd : orderPeggingCds) {
                    orderCd = orderCd.trim();
                    if (soCds.contains(orderCd)) {
                        SoStockAssign soStockAssign = new SoStockAssign();
                        soStockAssign.setStockCd(stockCd);
                        soStockAssign.setSoCd(orderCd);
                        soStockAssign.setAssignYn(true);
                        saveSoStockAssigns.add(soStockAssign);
                    } else if (woCds.contains(orderCd)) {
                        WoStockAssign woStockAssign = new WoStockAssign();
                        woStockAssign.setStockCd(stockCd);
                        woStockAssign.setWoCd(orderCd);
                        woStockAssign.setAssignYn(true);
                        saveWoStockAssigns.add(woStockAssign);
                    }
                }
            }
        }

        try {
            stockRepository.saveAll(stocks);
            soStockAssignRepository.deleteAll(deleteSoStockAssigns);
            soStockAssignRepository.saveAll(saveSoStockAssigns);
            woStockAssignRepository.deleteAll(deleteWoStockAssigns);
            woStockAssignRepository.saveAll(saveWoStockAssigns);
            return true;
        } catch (Exception ignored) {
        }
        return false;

    }

    public boolean deleteStocks(List<Stock> stocks) {
        Map<String, List<SoStockAssign>> soStockAssignMap = soStockAssignRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(SoStockAssign::getStockCd, LinkedHashMap::new, Collectors.toList()));

        Map<String, List<WoStockAssign>> woStockAssignMap = woStockAssignRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(WoStockAssign::getStockCd, LinkedHashMap::new, Collectors.toList()));

        List<SoStockAssign> deleteSoStockAssigns = new ArrayList<>();
        List<WoStockAssign> deleteWoStockAssigns = new ArrayList<>();

        for (Stock stock : stocks) {
            String stockCd = stock.getStockCd();
            if (soStockAssignMap.containsKey(stockCd)) {
                deleteSoStockAssigns.addAll(soStockAssignMap.get(stockCd));
            }
            if (woStockAssignMap.containsKey(stockCd)) {
                deleteWoStockAssigns.addAll(woStockAssignMap.get(stockCd));
            }
        }

        try {
            soStockAssignRepository.deleteAll(deleteSoStockAssigns);
            woStockAssignRepository.deleteAll(deleteWoStockAssigns);
            stockRepository.deleteAll(stocks);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }
}
