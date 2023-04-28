package com.zionex.t3series.web.domain.fp.master;

import com.zionex.t3series.web.domain.fp.bom.BomRouting;
import com.zionex.t3series.web.domain.fp.bom.BomRoutingService;
import com.zionex.t3series.web.domain.fp.bor.Bor;
import com.zionex.t3series.web.domain.fp.bor.BorService;
import com.zionex.t3series.web.domain.fp.item.Inventory;
import com.zionex.t3series.web.domain.fp.item.InventoryService;
import com.zionex.t3series.web.domain.fp.order.SalesOrder;
import com.zionex.t3series.web.domain.fp.order.SalesOrderService;
import com.zionex.t3series.web.domain.fp.order.WorkOrder;
import com.zionex.t3series.web.domain.fp.order.WorkOrderService;
import com.zionex.t3series.web.domain.fp.stock.Stock;
import com.zionex.t3series.web.domain.fp.stock.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ValidationMstService {

    private static final String MODEL_NOT_FOUND = "Model Not Found";

    private static final String VALID_TYPE_ALL = "FP_VALID_TYPE_ALL";
    private static final String VALID_TYPE_BOM = "FP_VALID_TYPE_BOM";
    private static final String VALID_TYPE_BOR = "FP_VALID_TYPE_BOR";
    private static final String VALID_TYPE_ORDER = "FP_VALID_TYPE_ORDER";
    private static final String VALID_TYPE_ITEM = "FP_VALID_TYPE_ITEM";

    private static final List<String> VALID_TYPES = new ArrayList<>(Arrays.asList(VALID_TYPE_BOM, VALID_TYPE_BOR, VALID_TYPE_ORDER, VALID_TYPE_ITEM));

    private static final String MODEL_ROUTE = "ROUTE";
    private static final String MODEL_ITEM = "ITEM";
    private static final String MODEL_INVENTORY = "INVENTORY";
    private static final String MODEL_WORK_ORDER = "WORK_ORDER";
    private static final String MODEL_SALES_ORDER = "SALES_ORDER";

    private static final String INVALID_EMPTY_CHILD = "FP_INVALID_EMPTY_CHILD";
    private static final String INVALID_EMPTY_PARENT = "FP_INVALID_EMPTY_PARENT";
    private static final String INVALID_EMPTY_ROUTE = "FP_INVALID_EMPTY_ROUTE";
    private static final String INVALID_EMPTY_RESOURCE = "FP_INVALID_EMPTY_RESOURCE";
    private static final String INVALID_EMPTY_STOCK = "FP_INVALID_EMPTY_STOCK";

    private static final String INVALID_REQUIRED_QTY = "FP_INVALID_REQUIRED_QTY";
    private static final String INVALID_ORDER_QTY = "FP_INVALID_ORDER_QTY";

    private static final String INVALID_LOT_SIZE = "FP_INVALID_LOT_SIZE";

    private final BomRoutingService bomRoutingService;
    private final BorService borService;
    private final SalesOrderService salesOrderService;
    private final WorkOrderService workOrderService;
    private final InventoryService inventoryService;
    private final StockService stockService;

    public List<ValidationMaster> doValidation(String validationType) {
        List<ValidationMaster> validationResult = new ArrayList<>();

        validationType = validationType == null || validationType.isEmpty() ? VALID_TYPE_ALL : validationType;

        if (VALID_TYPE_ALL.equals(validationType)) {
            for (String type : VALID_TYPES) {
                validationResult.add(doValidationWithType(type));
            }
        } else {
            validationResult.add(doValidationWithType(validationType));
        }

        return validationResult;
    }

    private ValidationMaster doValidationWithType(String validationType) {
        switch (validationType) {
            case VALID_TYPE_BOM:
                return bomValidation();
            case VALID_TYPE_BOR:
                return borValidation();
            case VALID_TYPE_ORDER:
                return orderValidation();
            case VALID_TYPE_ITEM:
                return itemValidation();
            default:
                return null;
        }
    }

    private ValidationMaster bomValidation() {
        ValidationMaster validationResult = new ValidationMaster();
        validationResult.setValidationType(VALID_TYPE_BOM);
        validationResult.setErrorCount(0);

        HashSet<String> parentRouteSet = (HashSet<String>)bomRoutingService.getBomRouting().stream()
                .filter(bomRouting -> "P".equals(bomRouting.getBomTpCd()))
                .map(BomRouting::getRouteCode)
                .collect(Collectors.toSet());

        HashSet<String> childRouteSet = (HashSet<String>)bomRoutingService.getBomRouting().stream()
                .filter(bomRouting -> "C".equals(bomRouting.getBomTpCd()))
                .map(BomRouting::getRouteCode)
                .collect(Collectors.toSet());

        int totalError = 0;
        int childError = 0;
        int parentError = 0;
        int bomRateError = 0;
        int routeError = 0;

        List<ValidationMaster.Model> childErrorModelList = new ArrayList<>();
        List<ValidationMaster.Model> parentErrorModelList = new ArrayList<>();
        List<ValidationMaster.Model> bomRateErrorModelList = new ArrayList<>();
        List<ValidationMaster.Model> routeErrorModelList = new ArrayList<>();

        for (BomRouting bomRouting : bomRoutingService.getBomRouting()) {
            if (bomRouting.getRoute() == null) {
                routeError += 1;
                totalError += 1;

                routeErrorModelList.add(getItemModel(bomRouting));

                continue;
            }

            if (bomRouting.getBomRate() == null || bomRouting.getBomRate() <= 0) {
                bomRateError += 1;
                totalError += 1;

                bomRateErrorModelList.add(getItemModel(bomRouting));
            }

            if (!"M".equals(bomRouting.getInventory().getItem().getItemClassCd())
                    && !childRouteSet.contains(bomRouting.getRouteCode())) {
                childError += 1;
                totalError += 1;

                childErrorModelList.add(getItemModel(bomRouting));
            }

            if (!"P".equals(bomRouting.getInventory().getItem().getItemClassCd())
                    && !parentRouteSet.contains(bomRouting.getRouteCode())) {
                parentError += 1;
                totalError += 1;

                parentErrorModelList.add(getItemModel(bomRouting));
            }
        }

        validationResult.setErrorCount(totalError);

        List<ValidationMaster.Detail> details = new ArrayList<>();

        details.add(getDetail(INVALID_EMPTY_CHILD, INVALID_EMPTY_CHILD, childError, childErrorModelList));
        details.add(getDetail(INVALID_EMPTY_PARENT, INVALID_EMPTY_PARENT, parentError, parentErrorModelList));
        details.add(getDetail(INVALID_REQUIRED_QTY, INVALID_REQUIRED_QTY, bomRateError, bomRateErrorModelList));
        details.add(getDetail(INVALID_EMPTY_ROUTE, INVALID_EMPTY_ROUTE, routeError, routeErrorModelList));

        validationResult.setDetails(details);

        return validationResult;
    }

    private ValidationMaster.Model getItemModel(BomRouting bomRouting) {
        ValidationMaster.Model model = new ValidationMaster.Model();
        model.setModel(MODEL_ITEM);

        if (bomRouting.getInventory() != null && bomRouting.getInventory().getItem() != null) {
            model.setModelCode(bomRouting.getInventory().getItem().getItemCd());
            model.setModelName(bomRouting.getInventory().getItem().getItemNm());
            model.setCreatedAt(bomRouting.getInventory().getItem().getCreatedAt());
            model.setCreatedBy(bomRouting.getInventory().getItem().getCreatedBy());
            model.setUpdatedAt(bomRouting.getInventory().getItem().getUpdatedAt());
            model.setUpdatedBy(bomRouting.getInventory().getItem().getUpdatedBy());
        } else {
            model.setModelCode(MODEL_NOT_FOUND);
            model.setModelName(MODEL_NOT_FOUND);
        }

        return model;
    }

    private ValidationMaster borValidation() {
        ValidationMaster validationResult = new ValidationMaster();
        validationResult.setValidationType(VALID_TYPE_BOR);
        validationResult.setErrorCount(0);

        int totalError = 0;
        int resourceError = 0;

        List<ValidationMaster.Model> resourceErrorModelList = new ArrayList<>();

        for (Bor bor : borService.getBors()) {
            ValidationMaster.Model model = new ValidationMaster.Model();

            if (bor.getResource() == null) {
                resourceError += 1;
                totalError += 1;

                model.setModel(MODEL_ROUTE);

                if (bor.getRoute() != null) {
                    model.setModelCode(bor.getRouteCode());
                    model.setModelName(bor.getRouteName());
                    model.setCreatedAt(bor.getRoute().getCreatedAt());
                    model.setCreatedBy(bor.getRoute().getCreatedBy());
                    model.setUpdatedAt(bor.getRoute().getUpdatedAt());
                    model.setUpdatedBy(bor.getRoute().getUpdatedBy());
                } else {
                    model.setModelCode(MODEL_NOT_FOUND);
                    model.setModelName(MODEL_NOT_FOUND);
                }

                resourceErrorModelList.add(model);
            }
        }

        validationResult.setErrorCount(totalError);

        List<ValidationMaster.Detail> details = new ArrayList<>();

        details.add(getDetail(INVALID_EMPTY_RESOURCE, INVALID_EMPTY_RESOURCE, resourceError, resourceErrorModelList));

        validationResult.setDetails(details);

        return validationResult;
    }

    private ValidationMaster orderValidation() {
        ValidationMaster validationResult = new ValidationMaster();
        validationResult.setValidationType(VALID_TYPE_ORDER);
        validationResult.setErrorCount(0);

        int totalError = 0;
        int orderQtyError = 0;

        List<ValidationMaster.Model> orderQtyErrorModelList = new ArrayList<>();

        for (SalesOrder salesOrder : salesOrderService.getSalesOrders()) {
            ValidationMaster.Model model = new ValidationMaster.Model();

            if (salesOrder.getRequestQty() == null || salesOrder.getRequestQty() <= 0) {
                orderQtyError += 1;
                totalError += 1;

                model.setModel(MODEL_SALES_ORDER);
                model.setModelCode(salesOrder.getSoCd());
                model.setModelName(salesOrder.getSoCd());
                model.setCreatedAt(salesOrder.getCreatedAt());
                model.setCreatedBy(salesOrder.getCreatedBy());
                model.setUpdatedAt(salesOrder.getUpdatedAt());
                model.setUpdatedBy(salesOrder.getUpdatedBy());

                orderQtyErrorModelList.add(model);
            }
        }

        for (WorkOrder workOrder : workOrderService.getWorkOrders()) {
            ValidationMaster.Model model = new ValidationMaster.Model();

            if (workOrder.getRequestQty() == null || workOrder.getRequestQty() <= 0) {
                orderQtyError += 1;
                totalError += 1;

                model.setModel(MODEL_WORK_ORDER);
                model.setModelCode(workOrder.getWoCd());
                model.setModelName(workOrder.getWoCd());
                model.setCreatedAt(workOrder.getCreatedAt());
                model.setCreatedBy(workOrder.getCreatedBy());
                model.setUpdatedAt(workOrder.getUpdatedAt());
                model.setUpdatedBy(workOrder.getUpdatedBy());

                orderQtyErrorModelList.add(model);
            }
        }

        validationResult.setErrorCount(totalError);

        List<ValidationMaster.Detail> details = new ArrayList<>();

        details.add(getDetail(INVALID_ORDER_QTY, INVALID_ORDER_QTY, orderQtyError, orderQtyErrorModelList));

        validationResult.setDetails(details);

        return validationResult;
    }

    private ValidationMaster itemValidation() {
        ValidationMaster validationResult = new ValidationMaster();
        validationResult.setValidationType(VALID_TYPE_ITEM);
        validationResult.setErrorCount(0);

        int totalError = 0;
        int stockError = 0;
        int lotSizeError = 0;

        List<ValidationMaster.Model> stockErrorModelList = new ArrayList<>();
        List<ValidationMaster.Model> lotSizeErrorModelList = new ArrayList<>();

        HashSet<String> stockInventoryCodes = (HashSet<String>)stockService.getStocks().stream()
                .map(Stock::getInventoryCode)
                .collect(Collectors.toSet());

        for (Inventory inventory : inventoryService.getInventories()) {
            ValidationMaster.Model model = new ValidationMaster.Model();

            if ("L".equals(inventory.getItemTpCd()) && !stockInventoryCodes.contains(inventory.getInventoryCd())) {
                stockError += 1;
                totalError += 1;

                model.setModel(MODEL_INVENTORY);
                model.setModelCode(inventory.getInventoryCd());
                model.setModelName(inventory.getInventoryNm());
                model.setCreatedAt(inventory.getCreatedAt());
                model.setCreatedBy(inventory.getCreatedBy());
                model.setUpdatedAt(inventory.getUpdatedAt());
                model.setUpdatedBy(inventory.getUpdatedBy());

                stockErrorModelList.add(model);
            }

            if ("P".equals(inventory.getItemClassCode())) {
                if (inventory.getItem() != null && (inventory.getItem().getWoSizeMax() == null || inventory.getItem().getWoSizeMax() <= 0)) {
                    lotSizeError += 1;
                    totalError += 1;

                    model.setModel(MODEL_ITEM);
                    if (inventory.getItem() != null) {
                        model.setModelCode(inventory.getItem().getItemCd());
                        model.setModelName(inventory.getItem().getItemNm());
                        model.setCreatedAt(inventory.getItem().getCreatedAt());
                        model.setCreatedBy(inventory.getItem().getCreatedBy());
                        model.setUpdatedAt(inventory.getItem().getUpdatedAt());
                        model.setUpdatedBy(inventory.getItem().getUpdatedBy());
                    } else {
                        model.setModelCode(MODEL_NOT_FOUND);
                        model.setModelName(MODEL_NOT_FOUND);
                    }

                    lotSizeErrorModelList.add(model);
                }
            }
        }

        validationResult.setErrorCount(totalError);

        List<ValidationMaster.Detail> details = new ArrayList<>();

        details.add(getDetail(INVALID_EMPTY_STOCK, INVALID_EMPTY_STOCK, stockError, stockErrorModelList));
        details.add(getDetail(INVALID_LOT_SIZE, INVALID_LOT_SIZE, lotSizeError, lotSizeErrorModelList));

        validationResult.setDetails(details);

        return validationResult;
    }

    private ValidationMaster.Detail getDetail(String validationType, String langKey, int errorCount, List<ValidationMaster.Model> models) {
        ValidationMaster.Detail detail = new ValidationMaster.Detail();

        detail.setValidationType(validationType);
        detail.setLangKey(langKey);
        detail.setErrorCount(errorCount);

        if (errorCount > 0 && models != null && models.size() > 0) {
            detail.setModels(models.stream().distinct().collect(Collectors.toList()));
        }

        return detail;
    }

}
