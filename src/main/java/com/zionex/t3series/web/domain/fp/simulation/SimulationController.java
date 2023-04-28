package com.zionex.t3series.web.domain.fp.simulation;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.domain.fp.plan.MainVersion;
import com.zionex.t3series.web.domain.fp.plan.PlanVersion;
import com.zionex.t3series.web.domain.fp.plan.SimulOption;
import com.zionex.t3series.web.util.ResponseEntityUtil.ResponseMessage;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/simulation/")
public class SimulationController {
    
    private final SimulationService simulationService;

    private final ObjectMapper objectMapper;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("main-versions/default")
    public MainVersion getVersionDefault(@RequestParam(value = "new-version", defaultValue = "false") boolean newVersion) {
        return simulationService.getVersionDefault(newVersion);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("main-versions")
    public ResponseEntity<ResponseMessage> saveMainVersion(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final MainVersion mainVersion = objectMapper.readValue(request.getParameter("changes") , new TypeReference<MainVersion>() {});

        return simulationService.saveMainVersion(mainVersion);
    }
    
    @GetMapping("details")
    public List<SimulationDetails> getSimulationDetails(@RequestParam("main-version-cd") String mainVersionCd) {
        return simulationService.getSimulationDetails(mainVersionCd);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("plan-versions")
    public ResponseEntity<ResponseMessage> savePlanVersion(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final PlanVersion planVersion = objectMapper.readValue(request.getParameter("changes") , new TypeReference<PlanVersion>() {});
        
        return simulationService.savePlanVersion(planVersion);
    }
    
    @GetMapping("history")
    public List<SimulationHistory> getSimulationHistories() {
        return simulationService.getSimulationHistories();
    }
    
    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("plan-versions/procedure")
    public ResponseEntity<ResponseMessage> executeProcedure(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final Map<String, Object> stepData = objectMapper.readValue(request.getParameter("changes") , new TypeReference<Map<String, Object>>() {});
        String mainVersionCd = (String) stepData.get("mainVersionCd");
        String stepCd = (String) stepData.get("stepCd");
        Long stepSeq = Long.parseLong(String.valueOf(stepData.get("stepSeq")));
        
        return simulationService.executeProcedure(mainVersionCd, stepCd, stepSeq);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("plan-versions/plan")
    public ResponseEntity<ResponseMessage> executePlan(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final PlanVersion planVersion = objectMapper.readValue(request.getParameter("changes") , new TypeReference<PlanVersion>() {});
        
        return simulationService.executePlan(planVersion);
    }
    
    @GetMapping("plan-versions/options")
    public List<SimulOption> getSimulationOptions(@RequestParam("plan-version-cd") String planVersionCd) {
        return simulationService.getSimulationOptions(planVersionCd);
    }

    @PostMapping("plan-versions/options")
    public ResponseEntity<ResponseMessage> saveSimulationOptions(@RequestBody List<SimulOption> simulOptions) {
        return simulationService.saveSimulationOptions(simulOptions);
    }
    
}
