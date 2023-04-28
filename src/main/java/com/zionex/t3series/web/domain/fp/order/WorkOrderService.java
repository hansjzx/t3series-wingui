package com.zionex.t3series.web.domain.fp.order;

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
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;

    private final WorkOrderQueryRepository workOrderQueryRepository;

    private final SalesOrderService salesOrderService;

    private final InventoryService inventoryService;

    public List<WorkOrder> getWorkOrdersByRouteCd(String routeCd) {
        return workOrderQueryRepository.getWorkOrdersByRouteCd(routeCd);
    }

    public List<WorkOrder> getWorkOrders() {
        return workOrderRepository.findAllByOrderByWoCd();
    }

    public List<WorkOrder> getWorkOrders(String workOrderCode) {
        workOrderCode = workOrderCode == null ? "" : workOrderCode;

        return workOrderRepository.findByWoCdContains(workOrderCode);
    }

    public boolean saveWorkOrders(List<WorkOrder> WorkOrders) {
        try {
            Map<String, SalesOrder> salesOrderMap = salesOrderService.getSalesOrders().stream()
                    .collect(Collectors.toMap(SalesOrder::getSoCd, Function.identity()));

            Map<String, Inventory> inventoryMap = inventoryService.getInventories().stream()
                    .collect(Collectors.toMap(Inventory::getInventoryCd, Function.identity()));

            Map<String, String> WorkOrderIdMap = getWorkOrders().stream()
                    .collect(Collectors.toMap(WorkOrder::getWoCd, WorkOrder::getId));

            for (WorkOrder workOrder : WorkOrders) {
                //not null and default value
                if (workOrder.getGrpPriority() == null) {
                    workOrder.setGrpPriority(1L);
                }

                if (workOrder.getRequestQty() == null) {
                    workOrder.setRequestQty(0d);
                }

                if (workOrder.getActiveYn() == null) {
                    workOrder.setActiveYn(true);
                }

                if (workOrder.getCancOnShtgYn() == null) {
                    workOrder.setCancOnShtgYn(true);
                }

                if (workOrder.getSoCode() != null && !workOrder.getSoCode().trim().isEmpty()) {
                    workOrder.setSalesOrder(salesOrderMap.get(workOrder.getSoCode()));
                }

                if (workOrder.getInventoryCode() != null && !workOrder.getInventoryCode().trim().isEmpty()) {
                    workOrder.setInventory(inventoryMap.get(workOrder.getInventoryCode()));
                }

                if (workOrder.getId() == null || workOrder.getId().trim().isEmpty()) {
                    workOrder.setId(WorkOrderIdMap.get(workOrder.getWoCd()));
                }
            }

            workOrderRepository.saveAll(WorkOrders);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

    public boolean deleteWorkOrders(List<WorkOrder> orderTypes) {
        try {
            workOrderRepository.deleteAll(orderTypes);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

}
