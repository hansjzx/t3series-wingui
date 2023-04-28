package com.zionex.t3series.web.domain.fp.simulation;

import com.zionex.t3series.web.domain.fp.activity.Activity;
import com.zionex.t3series.web.domain.fp.activity.ActivityQueryRepository;
import com.zionex.t3series.web.domain.fp.order.WoPlan;
import com.zionex.t3series.web.domain.fp.order.WoPlanService;
import com.zionex.t3series.web.domain.fp.plan.PlanVersion;
import com.zionex.t3series.web.domain.fp.plan.PlanVersionService;
import com.zionex.t3series.web.domain.fp.resource.ResrcUtilization;
import com.zionex.t3series.web.domain.fp.resource.ResrcUtilizationService;
import com.zionex.t3series.web.domain.fp.setting.SettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SimulationKPIService {

    private final WoPlanService woPlanService;
    private final PlanVersionService planVersionService;
    private final SettingService settingService;
    private final ResrcUtilizationService resrcUtilizationService;
    private final ActivityQueryRepository activityQueryRepository;

    private static final String FP_SEARCH_ZONE = "FP_SEARCH_ZONE";
    private static final String DATE_PATTERN = "yyyy-MM-dd";

    public float getOnTimeRate(String versionCd, List<String> plants) {
        List<WoPlan> woPlans = woPlanService.getWorkOrderPlans(versionCd, plants);
        int toTalOrderCnt = woPlans.size();
        long onTimeOrderCnt = woPlans.stream()
                .filter(woPlan -> !woPlan.getLateYn() && !woPlan.getShtgYn())
                .count();
        return (toTalOrderCnt == 0) ? 0 : Math.round((float) Long.valueOf(onTimeOrderCnt).intValue() / toTalOrderCnt * 100 * 10) / 10.0f;
    }

    public Map<String, List<Object>> getLeadTime(String versionCd, List<String> plants) {
          Map<String, Double> leadTimeMap = woPlanService.getWorkOrderPlans(versionCd, plants)
                .stream()
                .filter(woPlan -> !woPlan.getShtgYn())
                .collect(Collectors.groupingBy(WoPlan::getInventoryCd,
                        Collectors.averagingDouble(woPlan -> {
                            double hoursDiff = (double) Duration.between(woPlan.getStartTs(), woPlan.getEndTs()).toHours() / 24;
                            return Math.round(hoursDiff * 10) / 10.0;
                        })));
        List<String> keySet = new ArrayList<>(leadTimeMap.keySet());
        keySet.sort(Comparator.comparing(leadTimeMap::get));
        Map<String, List<Object>> result = new HashMap<>();
        result.put("labels", new ArrayList<>());
        result.put("data", new ArrayList<>());
        for (String key : keySet) {
            if (result.get("labels").size() < 10) {
                result.get("labels").add(key);
                result.get("data").add(Math.round(leadTimeMap.get(key) * 10) / 10.0);
            }
        }
        return result;
    }

    public Map<String, List<Object>> getResourceUtilization(String versionCd, List<String> plants) {
        PlanVersion planVersion = planVersionService.getPlanVersionByVersionCd(versionCd);
        Map<String, List<Object>> result = new HashMap<>();
        result.put("labels", new ArrayList<>());
        result.put("data", new ArrayList<>());
        if (planVersion != null) {
            int searchZone = Integer.parseInt(settingService.getSettingsBySettingCds(Collections.singletonList(FP_SEARCH_ZONE)).get(0).getSettingVal());
            List<ResrcUtilization> resrcUtilizations = resrcUtilizationService.getResrcUtilizationByVersionAndDate(versionCd, plants, planVersion.getStartTs(), planVersion.getStartTs().plusDays(searchZone));
            Map<String, Double> resourceUtilizationMap = resrcUtilizations.stream()
                    .collect(Collectors.groupingBy(r -> r.getStartTs().format(DateTimeFormatter.ofPattern(DATE_PATTERN)),
                            Collectors.averagingDouble(ResrcUtilization::getUsedRate)
                    ));

            List<String> keySet = new ArrayList<>(resourceUtilizationMap.keySet());
            keySet.sort(Comparator.naturalOrder());
            for (String key : keySet) {
                result.get("labels").add(key);
                result.get("data").add(Math.round(resourceUtilizationMap.get(key) * 10) / 10.0);
            }
        }
        return result;
    }

    public Map<String, List<Object>> getJobChange(String versionCd, List<String> plants) {
        List<Activity> activities = activityQueryRepository.getActivitiesWithJcTime(versionCd, plants);
        Map<String, Double> jcTmSum = activities.stream()
                .collect(Collectors.groupingBy(Activity::getResourceCd,
                        Collectors.summingDouble(activity -> activity.getPrevJcTm() + activity.getNextJcTm())
                ));
        Map<String, Double> jcCntSum = activities.stream()
                .collect(Collectors.groupingBy(Activity::getResourceCd,
                        Collectors.summingDouble(activity -> (activity.getPrevJcTm() > 0 && activity.getNextJcTm() > 0) ? 2 : 1)
                ));
        List<String> keySet = new ArrayList<>(jcTmSum.keySet());
        keySet.sort(Comparator.comparing(jcTmSum::get, Comparator.reverseOrder()));
        Map<String, List<Object>> result = new HashMap<>();
        result.put("labels", new ArrayList<>());
        result.put("jcTmSumData", new ArrayList<>());
        result.put("jcCntSumData", new ArrayList<>());
        for (String key : keySet) {
            if (result.get("labels").size() < 5) {
                result.get("labels").add(key);
                result.get("jcTmSumData").add(jcTmSum.get(key));
                result.get("jcCntSumData").add(jcCntSum.get(key));
            }
        }
        return result;
    }
}
