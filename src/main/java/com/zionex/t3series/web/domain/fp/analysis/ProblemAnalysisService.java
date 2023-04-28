package com.zionex.t3series.web.domain.fp.analysis;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import com.zionex.t3series.web.domain.fp.order.WoPlan;
import com.zionex.t3series.web.domain.fp.order.WoPlanService;
import com.zionex.t3series.web.domain.fp.organization.Plant;
import com.zionex.t3series.web.domain.fp.organization.PlantService;

import com.zionex.t3series.web.domain.fp.plan.PlanProblem;
import com.zionex.t3series.web.domain.fp.plan.PlanProblemService;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProblemAnalysisService {

    private final PlanProblemService planProblemService;

    private final PlantService plantService;
    
    private final WoPlanService woPlanService;

    private static final String FP_STATUS_TYPE_PASS = "PASS";
    private static final String FP_STATUS_TYPE_UNUSE = "UNUSE";

    public Map<String, Map<String, Long>> getProblemStatus(String versionCd, List<String> plantCds) {
        Map<String, Map<String, Long>> problemStatusMap = new HashMap<>();

        List<PlanProblem> planProblems = planProblemService.getPlanProblems(versionCd, plantCds);
        if (planProblems != null) {
            List<PlanProblem> planLateProblems = new ArrayList<>();
            List<PlanProblem> planShortProblems = new ArrayList<>();

            planProblems.forEach(pp -> {
                String problemTypeCd = pp.getProblemTypeCd();
                if (problemTypeCd.equals("FP_DELIVERY_DELAY")) {
                    planLateProblems.add(pp);
                } else if (problemTypeCd.equals("FP_DELIVERY_SHORT")) {
                    planShortProblems.add(pp);
                }
            });

            Map<String, Long> groupedPlanLateProblems = planLateProblems
                    .stream()
                    .collect(Collectors.groupingBy(PlanProblem::getProblemReasonTypeCd, Collectors.counting()))
                    .entrySet()
                    .stream()
                    .sorted(Entry.comparingByValue(Comparator.reverseOrder()))
                    .collect(Collectors.toMap(Entry::getKey, Entry::getValue, (e1, e2) -> e2, LinkedHashMap::new));
            problemStatusMap.put("deliveryDelayStatus", groupedPlanLateProblems);

            Map<String, Long> groupedShortProblems = planShortProblems
                    .stream()
                    .collect(Collectors.groupingBy(PlanProblem::getProblemReasonTypeCd, Collectors.counting()))
                    .entrySet()
                    .stream()
                    .sorted(Entry.comparingByValue(Comparator.reverseOrder()))
                    .collect(Collectors.toMap(Entry::getKey, Entry::getValue, (e1, e2) -> e2, LinkedHashMap::new));
            problemStatusMap.put("planFailStatus", groupedShortProblems);
        }

        return problemStatusMap;
    }

    public List<PlanProblem> getProblemStatusDetail(String versionCd, List<String> plantCds) {
        List<PlanProblem> planProblems = planProblemService.getPlanProblems(versionCd, plantCds);
        if (planProblems != null) {
            Map<String, String> plants = plantService.getPlants()
                    .stream()
                    .collect(Collectors.toMap(Plant::getPlantCd, Plant::getPlantNm));

            planProblems = planProblems
                    .stream()
                    .sorted(Comparator.comparing(PlanProblem::getPlantCd).thenComparing(PlanProblem::getProblemTypeCd).thenComparing(PlanProblem::getDueDate))
                    .peek(pp -> pp.setPlantNm(plants.get(pp.getPlantCd())))
                    .collect(Collectors.toList());
        }

        return planProblems;
    }

    public KPIResult getKPI(String versionCd, List<String> plantCds) {
        int totalCnt = 0;
        int okCnt = 0;
        int lateCnt = 0;
        int shortCnt = 0;
        List<WoPlan> woPlans = woPlanService.getWorkOrderPlans(versionCd, plantCds);
        if (woPlans != null) {
            for (WoPlan wp : woPlans) {
                String planStatusType = wp.getPlanStatusTpCd();
                boolean lateYn = wp.getLateYn();
                boolean shortYn = wp.getShtgYn();
                if (!planStatusType.equals(FP_STATUS_TYPE_UNUSE)) {
                    totalCnt++;
                }
                if (planStatusType.equals(FP_STATUS_TYPE_PASS) && !lateYn && !shortYn) {
                    okCnt++;
                }
                if (lateYn && !shortYn) {
                    lateCnt++;
                }
                if (lateYn && shortYn) {
                    shortCnt++;
                }
            }
            float okRate = Math.round(((float) okCnt / totalCnt) * 100 * 10) / 10.0f;            
            return KPIResult.builder().totalCnt(totalCnt).okCnt(okCnt).lateCnt(lateCnt).shortCnt(shortCnt).okRate(okRate)
                    .build();
        }
        return null;
    }

}
