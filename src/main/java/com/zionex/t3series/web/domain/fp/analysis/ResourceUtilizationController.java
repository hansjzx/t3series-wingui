package com.zionex.t3series.web.domain.fp.analysis;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/resource-utilization/")
public class ResourceUtilizationController {

    private final ResourceUtilizationService resourceUtilizationService;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("utilization")
    public Map<String, Object> getResourceUtilization(@RequestParam("version-cd") String versionCd, @RequestParam("plant-cds") List<String> plantCds,
                                                      @RequestParam("start-date") String startDate, @RequestParam(value = "end-date") String endDate,
                                                      @RequestParam(value = "entire-period", required = false) boolean isEntirePlanPeriod) {

        return resourceUtilizationService.getResourceUtilization(versionCd, plantCds, startDate, endDate, isEntirePlanPeriod);
    }

}
