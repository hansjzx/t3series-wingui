package com.zionex.t3series.web.domain.fp.simulation;

import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.util.interceptor.ExecPermission;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/simulation-kpi/")
public class SimulationKPIController {
    
    private final SimulationKPIService simulationKPIService;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("on-time-rate")
    public float getOnTimeRate(@RequestParam("version-cd") String versionCd, @RequestParam("plant-cds") List<String> plantCds) {
        return simulationKPIService.getOnTimeRate(versionCd, plantCds);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("lead-time")
    public Map<String, List<Object>> getLeadTime(@RequestParam("version-cd") String versionCd, @RequestParam("plant-cds") List<String> plantCds) {
        return simulationKPIService.getLeadTime(versionCd, plantCds);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("resource-utilization")
    public Map<String, List<Object>> getResourceUtilization(@RequestParam("version-cd") String versionCd, @RequestParam("plant-cds") List<String> plantCds) {
        return simulationKPIService.getResourceUtilization(versionCd, plantCds);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("job-change")
    public Map<String, List<Object>> getJobChange(@RequestParam("version-cd") String versionCd, @RequestParam("plant-cds") List<String> plantCds) {
        return simulationKPIService.getJobChange(versionCd, plantCds);
    }
    
}
