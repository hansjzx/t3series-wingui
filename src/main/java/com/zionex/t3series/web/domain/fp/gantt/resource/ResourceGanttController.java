package com.zionex.t3series.web.domain.fp.gantt.resource;

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
@RequestMapping("/factoryplan/resource-gantt/")
public class ResourceGanttController {

    private final ResourceGanttService resourceGanttService;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("activities")
    public List<ResourceGanttResult> getActivities(@RequestParam("version-cd") String versionCd, @RequestParam("plant-cds") List<String> plantCds) {

        return resourceGanttService.getActivities(versionCd, plantCds);
    }
    
    @GetMapping("activity/detail")
    public ActivityDetail getActivityDetail(@RequestParam("version-cd") String versionCd, @RequestParam("plant-cd") String plantCd,
                                            @RequestParam("resource-cd") String resourceCd, @RequestParam("activity-id") Long activityId) {
        return resourceGanttService.getActivityDetail(versionCd, plantCd, resourceCd, activityId);
    }

    @GetMapping("activity/tooltip")
    public ActivityDetail getActivityTooltip(@RequestParam("version-cd") String versionCd, @RequestParam("plant-cd") String plantCd,
                                             @RequestParam("resource-cd") String resourceCd, @RequestParam("activity-id") Long activityId) {
        return resourceGanttService.getActivityTooltip(versionCd, plantCd, resourceCd, activityId);
    }
    
    @GetMapping("frozen-zone")
    public String getFrozenZone(@RequestParam("version-cd") String versionCd) {
        return resourceGanttService.getFrozenZone(versionCd);
    }

}
