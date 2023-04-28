package com.zionex.t3series.web.domain.fp.simulation;

import com.zionex.t3series.web.domain.admin.lang.LangPackService;
import com.zionex.t3series.web.domain.fp.plan.PlanStep;
import com.zionex.t3series.web.domain.fp.plan.PlanStepSeq;
import com.zionex.t3series.web.domain.fp.plan.PlanStepSeqService;
import com.zionex.t3series.web.domain.fp.plan.PlanStepService;
import com.zionex.t3series.web.util.ResponseEntityUtil;
import com.zionex.t3series.web.util.ResponseEntityUtil.ResponseMessage;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SimulationStepService {

    private static final String STEP_CD_PREFIX = "FP_STEP_";
    private static final String DATETIME_PATTERN = "yyyyMMddHHmmss";
    
    private final PlanStepSeqService planStepSeqService;
    private final PlanStepService planStepService;
    private final LangPackService langPackService;
    
    public List<PlanStepSeq> getPlanStepSeqs(String stepCd) {
        return planStepSeqService.getPlanStepSeqsByStepCd(stepCd);
    }

    public ResponseEntity<ResponseMessage> savePlanStepAndSeqs(String stepNm, List<PlanStepSeq> updateData, List<PlanStepSeq> createData, List<PlanStepSeq> deleteData) {
        String resultMsg = langPackService.getLanguageValue("MSG_0001");
        String stepCd = null;
        try {
            if (StringUtils.isNotEmpty(stepNm)) {
                LocalDateTime now = LocalDateTime.now();
                now.format(DateTimeFormatter.ofPattern(DATETIME_PATTERN));
                PlanStep planStep = new PlanStep();
                stepCd = STEP_CD_PREFIX + now.format(DateTimeFormatter.ofPattern(DATETIME_PATTERN));
                planStep.setStepCd(stepCd);
                planStep.setStepNm(stepNm);
                planStepService.savePlanStep(planStep);
                for (PlanStepSeq planStepSeq : updateData) {
                    planStepSeq.setStepCd(stepCd);
                }
                for (PlanStepSeq planStepSeq : createData) {
                    planStepSeq.setStepCd(stepCd);
                }
            }
            planStepSeqService.deletePlanStepSeqs(updateData);
            planStepSeqService.deletePlanStepSeqs(deleteData);
            planStepSeqService.savePlanStepSeqs(updateData);
            planStepSeqService.savePlanStepSeqs(createData);
            return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), resultMsg, stepCd));
        } catch (Exception e) {
            return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage()));
        }
    }
}
