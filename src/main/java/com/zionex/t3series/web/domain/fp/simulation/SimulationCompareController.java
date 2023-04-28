package com.zionex.t3series.web.domain.fp.simulation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.domain.fp.plan.PlanVersion;
import com.zionex.t3series.web.util.interceptor.ExecPermission;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import com.zionex.t3series.web.util.ResponseEntityUtil.ResponseMessage;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/simulation-compare/")
public class SimulationCompareController {
    
    private final SimulationCompareService simulationCompareService;

    private final ObjectMapper objectMapper;

    @GetMapping("versions")
    public Map<String, List<PlanVersion>> getVersions(@RequestParam("planning-date") String planningDate) {
        return simulationCompareService.getVersions(planningDate);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("on-time-rate")
    public Map<String, List<Object>> getOnTimeRate(@RequestParam("version-cds") List<String> versionCds) {
        return simulationCompareService.getOnTimeRate(versionCds);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("lead-time")
    public Map<String, List<Object>> getLeadTime(@RequestParam("version-cds") List<String> versionCds) {
        return simulationCompareService.getLeadTime(versionCds);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("resource-utilization")
    public Map<String, List<Object>> getResourceUtilization(@RequestParam("version-cds") List<String> versionCds) {
        return simulationCompareService.getResourceUtilization(versionCds);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("job-change")
    public Map<String, List<Object>> getJobChange(@RequestParam("version-cds") List<String> versionCds) {
        return simulationCompareService.getJobChange(versionCds);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("confirm")
    public ResponseEntity<ResponseMessage> confirmSimulationVersion(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final String versionCd = objectMapper.readValue(request.getParameter("changes") , new TypeReference<String>() {});
        
        return simulationCompareService.confirmSimulationVersion(versionCd);
    }
    
}
