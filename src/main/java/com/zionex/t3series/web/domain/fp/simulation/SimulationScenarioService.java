package com.zionex.t3series.web.domain.fp.simulation;

import com.zionex.t3series.web.domain.admin.lang.LangPackService;
import com.zionex.t3series.web.domain.fp.plan.PlanPolicy;
import com.zionex.t3series.web.domain.fp.plan.PlanPolicyDetail;
import com.zionex.t3series.web.domain.fp.plan.PlanPolicyDetailService;
import com.zionex.t3series.web.domain.fp.plan.PlanPolicyService;
import com.zionex.t3series.web.util.ResponseEntityUtil;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.zionex.t3series.web.util.ResponseEntityUtil.ResponseMessage;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SimulationScenarioService {

    private static final String POLICY_CD_PREFIX = "FP_POLICY_";
    private static final String DATETIME_PATTERN = "yyyyMMddHHmmss";

    private final PlanPolicyDetailService planPolicyDetailService;
    private final PlanPolicyService planPolicyService;
    private final LangPackService langPackService;

    public ResponseEntity<ResponseMessage> savePlanPolicyAndDetails(String policyNm, String scriptNm, List<PlanPolicyDetail> planPolicyDetails) {
        String resultMsg = langPackService.getLanguageValue("MSG_0001");
        try {
            String policyCd;
            PlanPolicy planPolicy;
            if (StringUtils.isNotEmpty(policyNm)) {
                LocalDateTime now = LocalDateTime.now();
                now.format(DateTimeFormatter.ofPattern(DATETIME_PATTERN));
                planPolicy = new PlanPolicy();
                policyCd = POLICY_CD_PREFIX + now.format(DateTimeFormatter.ofPattern(DATETIME_PATTERN));
                planPolicy.setPolicyCd(policyCd);
                planPolicy.setRequiredYn(false);
                planPolicy.setDefaultYn(false);
                planPolicy.setPolicyNm(policyNm);
                for (PlanPolicyDetail planPolicyDetail : planPolicyDetails) {
                    planPolicyDetail.setPolicyCd(policyCd);
                }
            } else {
                policyCd = planPolicyDetails.get(0).getPolicyCd();
                planPolicy = planPolicyService.getPlanPolicyByPolicyCd(policyCd);
                planPolicyDetailService.deletePlanPolicyDetails(policyCd);
            }
            planPolicy.setScriptNm(scriptNm);
            planPolicyService.savePlanPolicy(planPolicy);
            planPolicyDetailService.savePlanPolicyDetails(planPolicyDetails);
            return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), resultMsg, planPolicy));
        } catch (Exception e) {
            return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage()));
        }
    }
}
