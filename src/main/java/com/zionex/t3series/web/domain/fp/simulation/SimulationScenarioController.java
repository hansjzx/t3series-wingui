package com.zionex.t3series.web.domain.fp.simulation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.domain.fp.plan.PlanPolicyDetail;
import com.zionex.t3series.web.util.ResponseEntityUtil.ResponseMessage;
import com.zionex.t3series.web.util.interceptor.ExecPermission;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/simulation-scenario/")
public class SimulationScenarioController {
    
    private final SimulationScenarioService simulationScenarioService;

    private final ObjectMapper objectMapper;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("policy-dtls")
    public ResponseEntity<ResponseMessage> savePlanPolicyAndDetails(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final Map<String, String> data = objectMapper.readValue(request.getParameter("changes") , new TypeReference<Map<String, String>>() {});
        List<PlanPolicyDetail> saveData = objectMapper.readValue(data.get("data"), new TypeReference<List<PlanPolicyDetail>>() {});
        
        return simulationScenarioService.savePlanPolicyAndDetails(data.get("policyNm"), data.get("scriptNm"), saveData);
    }

}
