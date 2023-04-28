package com.zionex.t3series.web.domain.mp.gantt.resource;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.persistence.ParameterMode;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MpResourceGanttService {

    private static final String HOLIDAY_STRT = "holidayStrtDate";
    private static final String HOLIDAY_END = "holidayEndDate";
    private static final String TILDE = "~";
    private static final String HOLIDAY_SUFFIX = "#20;";

    private final MpResourceGanttQureyRepository mpResourceGanttQureyRepository;

    public MpPlanHorizon getPlanHorizon(String simulVer) {
        Map<String, Object> params = new HashMap<>();
        params.put("SIMUL_VER_ID", new Object[]{simulVer, String.class, ParameterMode.IN});

        return mpResourceGanttQureyRepository.getPlanHorizon(simulVer);
    }
    
    public List<MpResourceGanttResult> getActivities(String mainVerId) {
        List<MpResourceGanttResult> ganttResult = new ArrayList<>();
        List<MpResourceGanttData> result = mpResourceGanttQureyRepository.getActivities(mainVerId);

        if (result == null || result.isEmpty()) {
            return ganttResult;
        }

        Collection<List<MpResourceGanttData>> groupedList = result.stream().collect(Collectors.groupingBy(MpResourceGanttData::getResourceId, LinkedHashMap::new, Collectors.toList())).values();
        Map<String, List<Map<String, String>>> resourceHolidayMap = getResourceHolidays(mainVerId);

        for (List<MpResourceGanttData> groupItem : groupedList) {
            List<MpResourceGanttResult.Activities> activities = new ArrayList<>();

            groupItem.stream().forEach(item -> {
                activities.add(MpResourceGanttResult.Activities.builder()
                        .id(item.getId())
                        .inventoryId(item.getInventoryId())
                        .planorderId(item.getPlanorderId())
                        .bucketStrtDt(item.getBucketStrtDate())
                        .bucketEndDt(item.getBucketEndDate())
                        .strtDt(item.getStrtDate())
                        .endDt(item.getEndDate())
                        .color(item.getColor())
                        .actHeight(item.getActHeight())
                        .text(item.getPlanorderId() + " : " + item.getQty())

                        .build()
                );
            });

            Collections.reverse(activities);

            String resourceId = groupItem.get(0).getResourceId();

            if (resourceHolidayMap.get(resourceId) != null && !resourceHolidayMap.get(resourceId).isEmpty()) {
                String holidaysColor = "";

                for (Map<String, String> holiday : resourceHolidayMap.get(resourceId)) {
                    holidaysColor += holiday.get(HOLIDAY_STRT) + TILDE + holiday.get(HOLIDAY_END) + HOLIDAY_SUFFIX;
                }

                ganttResult.add(MpResourceGanttResult.builder()
                        .resourceId(groupItem.get(0).getResourceId())
                        .displaySeq(groupItem.get(0).getDisplaySeq())
                        .activities(activities)
                        .holidays(holidaysColor)

                        .build());
            } else {
                ganttResult.add(MpResourceGanttResult.builder()
                        .resourceId(groupItem.get(0).getResourceId())
                        .displaySeq(groupItem.get(0).getDisplaySeq())
                        .activities(activities)

                        .build());
            }

        }

        return ganttResult;
    }

    public MpResourceGanttDetail getActivityDetail(String id) {
        return mpResourceGanttQureyRepository.getActivityDetail(id);
    }
    
    public Map<String, List<Map<String, String>>> getResourceHolidays(String mainVerId) {
        Map<String, List<Map<String, String>>> resourceHolidayMap = new HashMap<>();
        List<MpResourceHoliday> result = mpResourceGanttQureyRepository.getResourceHolidays(mainVerId);

        Collection<List<MpResourceHoliday>> groupedList = result.stream().collect(Collectors.groupingBy(MpResourceHoliday::getResourceId, LinkedHashMap::new, Collectors.toList())).values();

        for (List<MpResourceHoliday> groupItem : groupedList) {
            List<Map<String, String>> holidayList = new ArrayList<>();
            
            groupItem.stream().forEach(item -> {
                Map<String, String> holiday = new HashMap<>();
                holiday.put(HOLIDAY_STRT, item.getStrtDate());
                holiday.put(HOLIDAY_END, item.getEndDate());

                holidayList.add(holiday);
            });

            resourceHolidayMap.put(groupItem.get(0).getResourceId(), holidayList);
        }

        return resourceHolidayMap;
    }
    
}
