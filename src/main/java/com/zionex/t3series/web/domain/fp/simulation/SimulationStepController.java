package com.zionex.t3series.web.domain.fp.simulation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.domain.fp.plan.PlanStepSeq;
import com.zionex.t3series.web.util.ResponseEntityUtil.ResponseMessage;
import com.zionex.t3series.web.util.interceptor.ExecPermission;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/factoryplan/simulation-step/")
public class SimulationStepController {
    
    private final SimulationStepService simulationStepService;

    private final ObjectMapper objectMapper;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("step-seqs")
    public List<PlanStepSeq> getPlanStepSeqs(@RequestParam("step-cd") String stepCd) {
        return simulationStepService.getPlanStepSeqs(stepCd);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("step-seqs")
    public ResponseEntity<ResponseMessage> savePlanStepAndSeqs(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final Map<String, String> data = objectMapper.readValue(request.getParameter("changes") , new TypeReference<Map<String, String>>() {});
        List<PlanStepSeq> updateData = objectMapper.readValue(data.get("update"), new TypeReference<List<PlanStepSeq>>() {});
        List<PlanStepSeq> createData = objectMapper.readValue(data.get("create"), new TypeReference<List<PlanStepSeq>>() {});
        List<PlanStepSeq> deleteData = objectMapper.readValue(data.get("delete"), new TypeReference<List<PlanStepSeq>>() {});
        
        return simulationStepService.savePlanStepAndSeqs(data.get("stepNm"), updateData, createData, deleteData);
    }
    
}
