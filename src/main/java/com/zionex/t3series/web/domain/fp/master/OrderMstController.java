package com.zionex.t3series.web.domain.fp.master;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.domain.fp.customer.Customer;
import com.zionex.t3series.web.domain.fp.customer.CustomerService;
import com.zionex.t3series.web.domain.fp.order.OrderType;
import com.zionex.t3series.web.domain.fp.order.OrderTypeService;
import com.zionex.t3series.web.domain.fp.order.SalesOrder;
import com.zionex.t3series.web.domain.fp.order.SalesOrderService;
import com.zionex.t3series.web.domain.fp.order.WorkOrder;
import com.zionex.t3series.web.domain.fp.order.WorkOrderService;
import com.zionex.t3series.web.util.ResponseMessage;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/master/order/")
public class OrderMstController {

    private final CustomerService customerService;
    private final OrderTypeService orderTypeService;
    private final SalesOrderService salesOrderService;
    private final WorkOrderService workOrderService;

    private final ObjectMapper objectMapper;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("salesorders")
    public List<SalesOrder> getSalesOrders(@RequestParam(value = "searchOrder", required = false) String searchOrder) throws UnsupportedEncodingException {
        if (searchOrder != null) {
            searchOrder = URLDecoder.decode(searchOrder, "UTF-8");
        }
        return salesOrderService.getSalesOrders(searchOrder);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("salesorders")
    public ResponseEntity<ResponseMessage> saveSalesOrders(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<SalesOrder> salesOrders = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<SalesOrder>>() {});

        salesOrderService.saveSalesOrders(salesOrders);

        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated SalesOrder entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("salesorders/delete")
    public ResponseEntity<ResponseMessage> deleteSalesOrders(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<SalesOrder> salesOrders = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<SalesOrder>>() {});

        salesOrderService.deleteSalesOrders(salesOrders);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Deleted SalesOrder entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("workorders")
    public List<WorkOrder> getWorkOrders(@RequestParam(value = "searchOrder", required = false) String searchOrder) throws UnsupportedEncodingException {
        if (searchOrder != null) {
            searchOrder = URLDecoder.decode(searchOrder, "UTF-8");
        }
        return workOrderService.getWorkOrders(searchOrder);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("workorders")
    public ResponseEntity<ResponseMessage> saveWorkOrders(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<WorkOrder> workOrders = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<WorkOrder>>() {});

        workOrderService.saveWorkOrders(workOrders);

        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated WorkOrder entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("workorders/delete")
    public ResponseEntity<ResponseMessage> deleteWorkOrders(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<WorkOrder> workOrders = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<WorkOrder>>() {});

        workOrderService.deleteWorkOrders(workOrders);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Deleted WorkOrder entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("customers")
    public ResponseEntity<ResponseMessage> saveCustomers(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<Customer> customers = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<Customer>>() {});

        customerService.saveCustomers(customers);

        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated Customer entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("customers/delete")
    public ResponseEntity<ResponseMessage> deleteCustomers(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<Customer> customers = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<Customer>>() {});

        customerService.deleteCustomers(customers);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Deleted Customer entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("ordertypes")
    public ResponseEntity<ResponseMessage> saveOrderTypes(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<OrderType> orderTypes = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<OrderType>>() {});

        orderTypeService.saveOrderTypes(orderTypes);

        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated OrderType entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("ordertypes/delete")
    public ResponseEntity<ResponseMessage> deleteOrderTypes(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<OrderType> orderTypes = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<OrderType>>() {});

        orderTypeService.deleteOrderTypes(orderTypes);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Deleted OrderType entities"), HttpStatus.OK);
    }

}
