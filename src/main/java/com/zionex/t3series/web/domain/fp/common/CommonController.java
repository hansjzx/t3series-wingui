package com.zionex.t3series.web.domain.fp.common;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.domain.fp.bom.BomRouting;
import com.zionex.t3series.web.domain.fp.bom.BomRoutingService;
import com.zionex.t3series.web.domain.fp.bor.Bor;
import com.zionex.t3series.web.domain.fp.bor.BorService;
import com.zionex.t3series.web.domain.fp.code.Code;
import com.zionex.t3series.web.domain.fp.code.CodeService;
import com.zionex.t3series.web.domain.fp.customer.Customer;
import com.zionex.t3series.web.domain.fp.customer.CustomerService;
import com.zionex.t3series.web.domain.fp.item.Inventory;
import com.zionex.t3series.web.domain.fp.item.InventoryService;
import com.zionex.t3series.web.domain.fp.item.Item;
import com.zionex.t3series.web.domain.fp.item.ItemGrp;
import com.zionex.t3series.web.domain.fp.item.ItemGrpService;
import com.zionex.t3series.web.domain.fp.item.ItemService;
import com.zionex.t3series.web.domain.fp.order.*;
import com.zionex.t3series.web.domain.fp.plan.*;

import com.zionex.t3series.web.domain.fp.resource.Resource;
import com.zionex.t3series.web.domain.fp.resource.ResourceService;
import com.zionex.t3series.web.domain.fp.route.Route;
import com.zionex.t3series.web.domain.fp.route.RouteGrp;
import com.zionex.t3series.web.domain.fp.route.RouteGrpService;
import com.zionex.t3series.web.domain.fp.setting.Setting;
import com.zionex.t3series.web.domain.fp.setting.SettingService;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController("fpCommonController")
@RequiredArgsConstructor
@RequestMapping("/factoryplan/")
public class CommonController {

    private final CommonService commonService;

    private final CodeService codeService;
    
    private final PlanPolicyService planPolicyService;

    private final PlanPolicyDetailService planPolicyDetailService;

    private final ItemGrpService itemGrpService;

    private final ItemService itemService;

    private final ResourceService resourceService;

    private final BomRoutingService bomRoutingService;

    private final InventoryService inventoryService;

    private final RouteGrpService routeGrpService;

    private final CustomerService customerService;

    private final OrderTypeService orderTypeService;

    private final WorkOrderService workOrderService;

    private final SalesOrderService salesOrderService;

    private final BorService borService;

    private final PlanStepService planStepService;
    
    private final SettingService settingService;

    @GetMapping("versions")
    public List<PlanVersion> getVersions(@RequestParam("planning-date") String planningDate) {
        return commonService.getVersions(planningDate);
    }

    @GetMapping("codes")
    public List<Code> getCodes(@RequestParam("code-group-cd") String codeGroupCd) {
        return codeService.getCodesByGroupCd(codeGroupCd);
    }

    @GetMapping("plan-policy")
    public List<PlanPolicy> getPlanPolicies() {
        return planPolicyService.getPlanPolicies();
    }
    
    @GetMapping("plan-policy-detail")
    public List<PlanPolicyDetail> getPlanPolicyDetails(@RequestParam("policy-cd") String policyCd) {
        return planPolicyDetailService.getPlanPolicyDetails(policyCd);
    }
    
    @GetMapping("setting")
    public List<Setting> getSettings(@RequestParam("setting-cds") List<String> settingCds) {
        return settingService.getSettingsBySettingCds(settingCds);
    }

    @GetMapping("itemGroups")
    public List<ItemGrp> getItemGroups(@RequestParam("search") String search) {
        return itemGrpService.getItemGroups(search);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("items")
    public List<Item> getItems(@RequestParam("search") String search) {
        return itemService.getItems(search);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("resources")
    public List<Resource> getResources(@RequestParam("search") String search) {
        return resourceService.getResources(search);
    }

    @GetMapping("producingroutes")
    public List<BomRouting> getProducingRoutes(@RequestParam("search") String search) {
        return bomRoutingService.getProducingBomRouting(search);
    }

    @GetMapping("resourceroutes")
    public List<Route> getResourceRoutes(@RequestParam("searchResourceCd") String searchResourceCd) {
        return borService.getBorRoutes(searchResourceCd);
    }

    @GetMapping("resourceroutegroups")
    public List<RouteGrp> getResourceRouteGroups(@RequestParam("searchResourceCd") String searchResourceCd) {
        return borService.getBorRouteGroups(searchResourceCd);
    }

    @GetMapping("stages-tree")
    public List<Map<String, Object>> getStagesTree() {
        return commonService.getStagesTree();
    }

    @GetMapping("inventories")
    public List<Inventory> getInventories(@RequestParam("search") String search) {
        return inventoryService.getInventories(search);
    }

    @GetMapping("orders")
    public List<WorkOrder> getOrders() {
        return commonService.getOrders();
    }

    @GetMapping("routegroups")
    public List<RouteGrp> getRouteGroups(@RequestParam("search") String search) {
        return routeGrpService.getRouteGroups(search);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("customers")
    public List<Customer> getCustomers() {
        return customerService.getCustomers();
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("ordertypes")
    public List<OrderType> getOrderTypes() {
        return orderTypeService.getOrderTypes();
    }

    @GetMapping("salesorders")
    public List<SalesOrder> getSalesOrders() {
        return salesOrderService.getSalesOrders();
    }

    @GetMapping("work-orders")
    public List<WorkOrder> getWorkOrders(@RequestParam("route-cd") String routeCd) {
        return workOrderService.getWorkOrdersByRouteCd(routeCd);
    }

    @GetMapping("bors")
    public List<Bor> getBors(@RequestParam("wo-cd") String woCd) {
        return borService.getBors(woCd);
    }

    @GetMapping("plan-steps")
    public List<PlanStep> getPlanSteps() {
        return planStepService.getPlanSteps();
    }

}
