package com.zionex.t3series.web.domain.mp.gantt.resource;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/masterplan/resource-gantt")
public class MpResourceGanttController {

    private final MpResourceGanttService mpResourceGanttService;

    @PostMapping("/plan-horizon")
    public MpPlanHorizon getPlanHorizon(@RequestParam("simul-version") String simulVer) {
        return mpResourceGanttService.getPlanHorizon(simulVer);        
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @PostMapping("")
    public List<MpResourceGanttResult> getActivities(@RequestParam("main-version-id") String mainVerId) {
        return mpResourceGanttService.getActivities(mainVerId);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @PostMapping("/activity-detail")
    public MpResourceGanttDetail getActivityDetail(@RequestParam("id") String id) {
        return mpResourceGanttService.getActivityDetail(id);
    }

}
