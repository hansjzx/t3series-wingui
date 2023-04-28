package com.zionex.t3series.web.domain.fp.simulation;

import com.zionex.t3series.web.domain.admin.lang.LangPackService;
import com.zionex.t3series.web.domain.admin.user.UserService;
import com.zionex.t3series.web.domain.fp.activity.Activity;
import com.zionex.t3series.web.domain.fp.activity.ActivityService;
import com.zionex.t3series.web.domain.fp.common.CommonService;
import com.zionex.t3series.web.domain.fp.order.WoPlan;
import com.zionex.t3series.web.domain.fp.order.WoPlanService;
import com.zionex.t3series.web.domain.fp.plan.*;
import com.zionex.t3series.web.domain.fp.resource.ResrcUtilization;
import com.zionex.t3series.web.domain.fp.resource.ResrcUtilizationService;
import com.zionex.t3series.web.domain.fp.setting.SettingService;
import com.zionex.t3series.web.util.ResponseEntityUtil;
import com.zionex.t3series.web.util.ResponseEntityUtil.ResponseMessage;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SimulationCompareService {

    private final MainVersionService mainVersionService;
    private final PlanVersionQueryRepository planVersionQueryRepository;
    private final PlanVersionService planVersionService;
    private final WoPlanService woPlanService;
    private final ResrcUtilizationService resrcUtilizationService;
    private final SettingService settingService;
    private final ActivityService activityService;
    private final LangPackService langPackService;
    private final UserService userService;
    private final CommonService commonService;

    private static final String DATE_PATTERN = "yyyyMMdd";
    private static final String FP_SEARCH_ZONE = "FP_SEARCH_ZONE";

    public Map<String, List<PlanVersion>> getVersions(String planningDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_PATTERN);
        if (StringUtils.isNotEmpty(planningDate)) {
            LocalDate date = LocalDate.parse(planningDate, formatter);
            Map<String, String> mainVersionMap = mainVersionService.getMainVersionsByPlanDt(date)
                    .stream()
                    .collect(Collectors.toMap(MainVersion::getMainVersionCd, MainVersion::getDescTxt));
            List<PlanVersion> planVersions = planVersionQueryRepository.getPlanVersionsByMainVersionCds(new ArrayList<>(mainVersionMap.keySet()));
            planVersions.forEach(pv -> pv.setPlants(commonService.getVersionPlants(pv.getVersionCd())));

            return planVersions
                    .stream()
                    .collect(Collectors.groupingBy(pv -> pv.getMainVersionCd() + " : " + mainVersionMap.get(pv.getMainVersionCd()), LinkedHashMap::new, Collectors.toList()));
        } else return null;
    }

    public Map<String, List<Object>> getOnTimeRate(List<String> versionCds) {
        Map<String, Long> totalOrderMap = woPlanService.getWorkOrderPlansByVersionCds(versionCds)
                .stream()
                .collect(Collectors.groupingBy(WoPlan::getVersionCd, Collectors.counting()));

        Map<String, Long> onTimeOrderMap = woPlanService.getWorkOrderPlansByVersionCds(versionCds)
                .stream()
                .filter(woPlan -> !woPlan.getLateYn() && !woPlan.getShtgYn())
                .collect(Collectors.groupingBy(WoPlan::getVersionCd, Collectors.counting()));

        versionCds.sort(Comparator.reverseOrder());
        Map<String, List<Object>> result = new HashMap<>();
        result.put("labels", new ArrayList<>());
        result.put("data", new ArrayList<>());
        for (String versionCd : versionCds) {
            result.get("labels").add(versionCd);
            if (totalOrderMap.get(versionCd) != null && onTimeOrderMap.get(versionCd) != null) {
                float onTimeRate = (totalOrderMap.get(versionCd).intValue() == 0 ) ? 0 : Math.round((float) onTimeOrderMap.get(versionCd).intValue() / totalOrderMap.get(versionCd).intValue() * 100 * 10) / 10.0f;
                result.get("data").add(onTimeRate);
            }
        }
        return result;
    }

    public Map<String, List<Object>> getLeadTime(List<String> versionCds) {
        Map<String, Double> leadTimeMap = woPlanService.getWorkOrderPlansByVersionCds(versionCds)
                .stream()
                .filter(woPlan -> !woPlan.getShtgYn())
                .collect(Collectors.groupingBy(WoPlan::getVersionCd,
                        Collectors.averagingDouble(woPlan -> {
                            double hoursDiff = (double) Duration.between(woPlan.getStartTs(), woPlan.getEndTs()).toHours() / 24;
                            return Math.round(hoursDiff * 10) / 10.0;
                        })));

        versionCds.sort(Comparator.reverseOrder());
        Map<String, List<Object>> result = new HashMap<>();
        result.put("labels", new ArrayList<>());
        result.put("data", new ArrayList<>());
        for (String versionCd : versionCds) {
            result.get("labels").add(versionCd);
            if (leadTimeMap.get(versionCd) != null) {
                result.get("data").add(Math.round(leadTimeMap.get(versionCd) * 10) / 10.0);
            }
        }
        return result;
    }

    public Map<String, List<Object>> getResourceUtilization(List<String> versionCds) {
        Map<String, List<Object>> result = new HashMap<>();
        result.put("labels", new ArrayList<>());
        result.put("data", new ArrayList<>());

        if (!versionCds.isEmpty()) {
            PlanVersion planVersion = planVersionService.getPlanVersionByVersionCd(versionCds.get(0));
            MainVersion mainVersion = mainVersionService.getMainVersionByVersionCd(planVersion.getMainVersionCd());
            int searchZone = Integer.parseInt(settingService.getSettingsBySettingCds(Collections.singletonList(FP_SEARCH_ZONE)).get(0).getSettingVal());
            List<ResrcUtilization> resrcUtilizations = resrcUtilizationService.getResrcUtilizationByVersionCdsAndDate(versionCds, mainVersion.getStartTs(), mainVersion.getStartTs().plusDays(searchZone));
            Map<String, Double> resourceUtilizationMap = resrcUtilizations.stream()
                    .collect(Collectors.groupingBy(ResrcUtilization::getVersionCd,
                            Collectors.averagingDouble(ResrcUtilization::getUsedRate)
                    ));
            versionCds.sort(Comparator.reverseOrder());
            for (String versionCd : versionCds) {
                result.get("labels").add(versionCd);
                if (resourceUtilizationMap.get(versionCd) != null) {
                    result.get("data").add(Math.round(resourceUtilizationMap.get(versionCd) * 10) / 10.0);
                }
            }
        }

        return result;
    }

    public Map<String, List<Object>> getJobChange(List<String> versionCds) {
        List<Activity> activities = activityService.getActivitiesByVersionCds(versionCds);
        Map<String, Double> jcTmSum = activities.stream()
                .filter(activity -> activity.getPrevJcTm() > 0 || activity.getNextJcTm() > 0)
                .collect(Collectors.groupingBy(Activity::getVersionCd,
                        Collectors.summingDouble(activity -> activity.getPrevJcTm() + activity.getNextJcTm())
                ));
        Map<String, Double> jcCntSum = activities.stream()
                .filter(activity -> activity.getPrevJcTm() > 0 || activity.getNextJcTm() > 0)
                .collect(Collectors.groupingBy(Activity::getVersionCd,
                        Collectors.summingDouble(activity -> (activity.getPrevJcTm() > 0 && activity.getNextJcTm() > 0) ? 2 : 1)
                ));

        versionCds.sort(Comparator.reverseOrder());
        Map<String, List<Object>> result = new HashMap<>();
        result.put("labels", new ArrayList<>());
        result.put("jcTmSumData", new ArrayList<>());
        result.put("jcCntSumData", new ArrayList<>());
        for (String versionCd : versionCds) {
            if (result.get("labels").size() < 5) {
                result.get("labels").add(versionCd);
                result.get("jcTmSumData").add(jcTmSum.get(versionCd));
                result.get("jcCntSumData").add(jcCntSum.get(versionCd));
            }
        }
        return result;
    }

    @Transactional
    public ResponseEntity<ResponseMessage> confirmSimulationVersion(String versionCd) {
        String userName = userService.getUserDetails().getUsername();
        String resultMsg = langPackService.getLanguageValue("시뮬레이션 버전이 확정되었습니다.");
        try {
            PlanVersion toBeConfirmedVersion = planVersionService.getPlanVersionByVersionCd(versionCd);
            String stepCd = toBeConfirmedVersion.getStepCd();
            long stepSeq = toBeConfirmedVersion.getStepSeq();
            List<PlanVersion> savePlanVersions = new ArrayList<>();
            List<PlanVersion> prevConfirmedVersion = planVersionService.getPlanVersionsByMainVersionCd(toBeConfirmedVersion.getMainVersionCd())
                    .stream()
                    .filter(pv -> stepCd.equals(pv.getStepCd()) && stepSeq == pv.getStepSeq() && pv.getConfirmYn())
                    .collect(Collectors.toList());

            if (!prevConfirmedVersion.isEmpty()) {
                PlanVersion confirmedVersion = prevConfirmedVersion.get(0);
                confirmedVersion.setConfirmYn(false);
                confirmedVersion.setConfirmedBy(null);
                confirmedVersion.setConfirmedAt(null);
                savePlanVersions.add(confirmedVersion);
            }
            toBeConfirmedVersion.setConfirmYn(true);
            toBeConfirmedVersion.setConfirmedBy(userName);
            toBeConfirmedVersion.setConfirmedAt(LocalDateTime.now());
            savePlanVersions.add(toBeConfirmedVersion);
            planVersionService.savePlanVersions(savePlanVersions);
            return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), resultMsg));
        } catch (Exception e) {
            return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(), langPackService.getLanguageValue("MSG_0004")));
        }
    }

}
