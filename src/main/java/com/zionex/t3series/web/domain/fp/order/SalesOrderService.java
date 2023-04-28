package com.zionex.t3series.web.domain.fp.order;

import com.zionex.t3series.web.domain.fp.customer.Customer;
import com.zionex.t3series.web.domain.fp.customer.CustomerService;
import com.zionex.t3series.web.domain.fp.item.Inventory;
import com.zionex.t3series.web.domain.fp.item.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalesOrderService {

    private final SalesOrderRepository salesOrderRepository;
    private final CustomerService customerService;
    private final InventoryService inventoryService;

    public List<SalesOrder> getSalesOrders() {
        return salesOrderRepository.findAll();
    }

    public List<SalesOrder> getSalesOrders(String salesOrderCode) {
        salesOrderCode = salesOrderCode == null ? "" : salesOrderCode;

        return salesOrderRepository.findBySoCdContains(salesOrderCode);
    }

    public boolean saveSalesOrders(List<SalesOrder> salesOrders) {
        try {
            Map<String, Customer> customerMap = customerService.getCustomers().stream()
                    .collect(Collectors.toMap(Customer::getCustomerCd, Function.identity()));

            Map<String, Inventory> inventoryMap = inventoryService.getInventories().stream()
                    .collect(Collectors.toMap(Inventory::getInventoryCd, Function.identity()));

            Map<String, String> salesOrderIdMap = getSalesOrders().stream()
                    .collect(Collectors.toMap(SalesOrder::getSoCd, SalesOrder::getId));

            for (SalesOrder salesOrder : salesOrders) {
                //not null and default value
                if (salesOrder.getGrpPriority() == null) {
                    salesOrder.setGrpPriority(1L);
                }

                if (salesOrder.getRequestQty() == null) {
                    salesOrder.setRequestQty(0d);
                }

                if (salesOrder.getActiveYn() == null) {
                    salesOrder.setActiveYn(true);
                }

                if (salesOrder.getCancOnShtgYn() == null) {
                    salesOrder.setCancOnShtgYn(true);
                }

                if (salesOrder.getCustomerCode() != null && !salesOrder.getCustomerCode().trim().isEmpty()) {
                    salesOrder.setCustomer(customerMap.get(salesOrder.getCustomerCode()));
                }

                if (salesOrder.getInventoryCode() != null && !salesOrder.getInventoryCode().trim().isEmpty()) {
                    salesOrder.setInventory(inventoryMap.get(salesOrder.getInventoryCode()));
                }

                if (salesOrder.getId() == null || salesOrder.getId().trim().isEmpty()) {
                    salesOrder.setId(salesOrderIdMap.get(salesOrder.getSoCd()));
                }
            }

            salesOrderRepository.saveAll(salesOrders);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

    public boolean deleteSalesOrders(List<SalesOrder> orderTypes) {
        try {
            salesOrderRepository.deleteAll(orderTypes);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

}
