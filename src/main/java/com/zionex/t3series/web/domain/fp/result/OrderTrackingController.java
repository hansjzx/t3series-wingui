package com.zionex.t3series.web.domain.fp.result;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/order-tracking/")
public class OrderTrackingController {

    private final OrderTrackingService orderTrackingService;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("orders")
    public List<OrderTrackingResult> getOrdersTree(@RequestParam("version-cd") String versionCd, @RequestParam("plant-cds") List<String> plantCds) {
        return orderTrackingService.getOrdersTree(versionCd, plantCds);
    }

}
