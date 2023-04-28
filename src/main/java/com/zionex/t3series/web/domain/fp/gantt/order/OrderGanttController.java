package com.zionex.t3series.web.domain.fp.gantt.order;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.domain.fp.gantt.resource.ActivityDetail;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/order-gantt/")
public class OrderGanttController {

    private final OrderGanttService orderGanttService;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("activities")
    public List<OrderGanttResult> getActivities(@RequestParam("version-cd") String versionCd, @RequestParam("plant-cds") List<String> plantCds) {

        return orderGanttService.getActivities(versionCd, plantCds);
    }

    @GetMapping("activity/tooltip/work-order")
    public ActivityDetail getWoTooltip(@RequestParam("version-cd") String versionCd, @RequestParam("plant-cd") String plantCd,
                                       @RequestParam("wo-cd") String woCd) {

        return orderGanttService.getWoTooltip(versionCd, plantCd, woCd);
    }

    @GetMapping("activity/tooltip/bom")
    public ActivityDetail getBomTooltip(@RequestParam("version-cd") String versionCd, @RequestParam("plant-cd") String plantCd,
                                        @RequestParam("resource-cd") String resourceCd, @RequestParam("activity-id") Long activityId) {

        return orderGanttService.getBomTooltip(versionCd, plantCd, resourceCd, activityId);
    }

}
