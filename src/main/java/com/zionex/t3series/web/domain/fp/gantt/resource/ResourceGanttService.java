package com.zionex.t3series.web.domain.fp.gantt.resource;

import com.zionex.t3series.web.domain.fp.activity.ActivityQueryRepository;
import com.zionex.t3series.web.util.converter.ColorConverter.ChartColor;
import com.zionex.t3series.web.domain.fp.plan.PlanVersion;
import com.zionex.t3series.web.domain.fp.plan.PlanVersionService;
import com.zionex.t3series.web.domain.fp.resource.Resource;
import com.zionex.t3series.web.domain.fp.resource.ResourceService;
import com.zionex.t3series.web.domain.fp.resource.ResrcDowntime;
import com.zionex.t3series.web.domain.fp.resource.ResrcDowntimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.zionex.t3series.web.domain.fp.gantt.resource.ResourceGanttResult.ActivityInfo;

@Service
@RequiredArgsConstructor
public class ResourceGanttService {

    private static final String DATETIME_PATTERN = "MM/dd/yyyy HH:mm";
    private static final String PREV_JC_COLOR = "#000000";
    private static final String NEXT_JC_COLOR = "#808080";
    private static final String DOWNTIME_SUFFIX = "#20;";
    private static final String FROZEN_SUFFIX = "#11;";
    private static final String TILDE = "~";

    private final ResourceService resourceService;
    private final PlanVersionService planVersionService;
    private final ActivityQueryRepository activityQueryRepository;
    private final ResrcDowntimeService resrcDowntimeService;

    public List<ResourceGanttResult> getActivities(String versionCd, List<String> plantCds) {
        Map<String, String> resourceMap = resourceService.getResources()
                .stream()
                .collect(Collectors.toMap(Resource::getResourceCd, Resource::getDisplayColor));
        List<ActivityInfo> activities = activityQueryRepository.getActivities(versionCd, plantCds);
        List<ResrcDowntime> downtimes = resrcDowntimeService.getResrcDowntimesByVersionCdAndPlantCds(versionCd, plantCds);
        List<ActivityDivisibleYDowntime> divisibleYDowntimes = activityQueryRepository.getDivisibleYDowntime(versionCd, plantCds);

        Collection<List<ActivityInfo>> groupedActivities = activities
                .stream()
                .collect(Collectors.groupingBy(ActivityInfo::getResourceCd, LinkedHashMap::new, Collectors.toList()))
                .values();
        Map<String, List<ResrcDowntime>> downtimesMap = downtimes.stream()
                .collect(Collectors.groupingBy(ResrcDowntime::getResourceCd, LinkedHashMap::new, Collectors.toList()));
        Map<Long, List<ActivityDivisibleYDowntime>> divisibleYDowntimesMap = divisibleYDowntimes.stream()
                .collect(Collectors.groupingBy(ActivityDivisibleYDowntime::getActivityId, LinkedHashMap::new, Collectors.toList()));
        List<ResourceGanttResult> ganttRows = new ArrayList<>();
        if (groupedActivities.isEmpty()) {
            return ganttRows;
        }

        String plant = groupedActivities.iterator().next().get(0).getPlantCd();
        int idx = 0;
        int startIdx = 0;
        int mergeRowCount = 0;

        for (List<ActivityInfo> group : groupedActivities) {
            List<ActivityInfo> jCActivities = new ArrayList<>();
            List<String> divisibleYDowntimeStrings = new ArrayList<>();
            for (ActivityInfo activityInfo : group) {
                if (activityInfo.getPrevJcTm() > 0) {
                    jCActivities.add(ActivityInfo.builder().resourceCd(activityInfo.getResourceCd()).jcYn("Y").displayColor(PREV_JC_COLOR)
                            .startTs(activityInfo.getPrevJcStartTs()).endTs(activityInfo.getPrevJcEndTs()).activityId(activityInfo.getActivityId())
                            .woCd(activityInfo.getWoCd()).itemCd(activityInfo.getItemCd()).build());
                }
                if (activityInfo.getNextJcTm() > 0) {
                    jCActivities.add(ActivityInfo.builder().resourceCd(activityInfo.getResourceCd()).jcYn("Y").displayColor(NEXT_JC_COLOR)
                            .startTs(activityInfo.getNextJcStartTs()).endTs(activityInfo.getNextJcEndTs()).activityId(activityInfo.getActivityId())
                            .woCd(activityInfo.getWoCd()).itemCd(activityInfo.getItemCd()).build());
                }
                if (divisibleYDowntimesMap.containsKey(activityInfo.getActivityId())) {
                    String divisibleYDowntimeString = divisibleYDowntimesMap.get(activityInfo.getActivityId())
                            .stream()
                            .filter(downtime -> !downtime.getDownStart().isEqual(downtime.getDownEnd()))
                            .map(downtime -> {
                                downtime.setDownEnd(downtime.getDownEnd().minusMinutes(6));
                                return formatDateTime(downtime.getDownStart()) + TILDE + formatDateTime(downtime.getDownEnd()) + DOWNTIME_SUFFIX;
                            })
                            .collect(Collectors.joining());
                    divisibleYDowntimeStrings.add(divisibleYDowntimeString);
                }
                String displayColor = ChartColor.getColorString(activityInfo.getDisplayColor());
                activityInfo.setDisplayColor(displayColor);
            }

            ActivityInfo firstActivity = group.get(0);
            String downtimeStrings = null;
            if (downtimesMap.containsKey(firstActivity.getResourceCd())) {
                downtimeStrings = downtimesMap.get(firstActivity.getResourceCd())
                        .stream()
                        .filter(downtime -> !downtime.getStartTs().isEqual(downtime.getEndTs()))
                        .map(downtime -> {
                            downtime.setEndTs(downtime.getEndTs().minusMinutes(6).minusSeconds(20));
                            return formatDateTime(downtime.getStartTs()) + TILDE + formatDateTime(downtime.getEndTs()) + DOWNTIME_SUFFIX;
                        })
                        .collect(Collectors.joining());
            }
            group.addAll(jCActivities);

            String displayColor = ChartColor.getColorString(resourceMap.get(firstActivity.getResourceCd()));
            ganttRows.add(ResourceGanttResult.builder().plantCd(firstActivity.getPlantCd()).plantNm(firstActivity.getPlantNm()).resourceCd(firstActivity.getResourceCd())
                    .resourceNm(firstActivity.getResourceNm()).downtimes(downtimeStrings).divisibleYDowntimes(String.join("", divisibleYDowntimeStrings)).displayColor(displayColor).activities(group).build());

            if (plant != null && firstActivity.getPlantCd() != null && plant.equals(firstActivity.getPlantCd())) {
                idx += 1;
                mergeRowCount += 1;
            } else {
                ganttRows.get(startIdx).setMergeRowCount(mergeRowCount);
                plant = firstActivity.getPlantCd();
                mergeRowCount = 1;
                startIdx = idx;
                idx += 1;
            }
            ganttRows.get(startIdx).setMergeRowCount(mergeRowCount);
        }

        return ganttRows;
    }

    public ActivityDetail getActivityDetail(String versionCd, String plantCd, String resourceCd, Long activityId) {
        ActivityDetail workDetail = activityQueryRepository.getWorkDetail(versionCd, plantCd, resourceCd, activityId);
        ActivityDetail orderDetail = activityQueryRepository.getOrderDetail(versionCd, plantCd, resourceCd, activityId);

        if (workDetail != null && orderDetail != null) {
            long tsDiffToSeconds = Duration.between(workDetail.getStartTs(), workDetail.getEndTs()).getSeconds();
            long woTsDiffToSeconds = Duration.between(orderDetail.getWoStartTs(), orderDetail.getWoEndTs()).getSeconds();

            orderDetail.setTsDiff(splitSeconds(tsDiffToSeconds));
            orderDetail.setWoTsDiff(splitSeconds(woTsDiffToSeconds));
            orderDetail.setItemCd(workDetail.getItemCd());
            orderDetail.setQty(workDetail.getQty());
            orderDetail.setStartTs(workDetail.getStartTs());
            orderDetail.setEndTs(workDetail.getEndTs());
            orderDetail.setResourceCd(workDetail.getResourceCd());
            orderDetail.setRouteCd(workDetail.getRouteCd());
            orderDetail.setWipYn(workDetail.getWipYn());
        }

        return orderDetail;
    }

    public ActivityDetail getActivityTooltip(String versionCd, String plantCd, String resourceCd, Long activityId) {
        ActivityDetail tooltip = activityQueryRepository.getTooltip(versionCd, plantCd, resourceCd, activityId);
        if (tooltip != null) {
            long tsDiffToSeconds = Duration.between(tooltip.getStartTs(), tooltip.getEndTs()).getSeconds();
            tooltip.setTsDiff(splitSeconds(tsDiffToSeconds));
        }
        return tooltip;
    }

    public String getFrozenZone(String versionCd) {
        PlanVersion planVersion = planVersionService.getPlanVersionByVersionCd(versionCd);
        if (planVersion == null) {
            return null;
        }
        return formatDateTime(planVersion.getStartTs()) + TILDE + formatDateTime(planVersion.getFreezeTs()) + FROZEN_SUFFIX;
    }

    private String formatDateTime(LocalDateTime datetime) {
        return datetime.format(DateTimeFormatter.ofPattern(DATETIME_PATTERN));
    }

    private String splitSeconds(long diffToSeconds) {
        long hours = diffToSeconds / 3600;
        long minutes = (diffToSeconds % 3600) < 60 ? 0 : diffToSeconds % 3600 / 60;
        long seconds = diffToSeconds % 3600 % 60;
        return hours + "시간 " + minutes + "분 " + seconds + "초";
    }

}
