package com.zionex.t3series.web.domain.fp.analysis;

import com.zionex.t3series.web.domain.fp.plan.PlanVersion;
import com.zionex.t3series.web.domain.fp.plan.PlanVersionService;
import com.zionex.t3series.web.domain.fp.resource.ResrcUtilization;
import com.zionex.t3series.web.domain.fp.resource.ResrcUtilizationService;
import com.zionex.t3series.web.domain.fp.setting.Setting;
import com.zionex.t3series.web.domain.fp.setting.SettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceUtilizationService {

    private final ResrcUtilizationService resrcUtilizationService;

    private final PlanVersionService planVersionService;
    
    private final SettingService settingService;

    private static final String DATE_PATTERN = "yyyyMMdd";
    private static final String DATE_PATTERN_WITH_HYPHENS = "yyyy-MM-dd";
    private static final String FP_UTILIZATION = "FP_UTILIZATION";
    private static final String FP_USED_TM = "FP_USED_TM";
    private static final String FP_AVAIL_TM = "FP_AVAIL_TM";
    private static final String FP_DECIMAL_PLACE = "FP_DECIMAL_PLACE";

    public Map<String, Object> getResourceUtilization(String versionCd, List<String> plantCds, String startDate, String endDate, boolean isEntirePlanPeriod) {
        LocalDateTime startDateTime;
        LocalDateTime endDateTime;
        if (isEntirePlanPeriod) {
            PlanVersion planVersion = planVersionService.getPlanVersionByVersionCd(versionCd);
            startDateTime = planVersion.getStartTs();
            endDateTime = planVersion.getEndTs();
        } else {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_PATTERN);
            startDateTime = LocalDateTime.of(LocalDate.parse(startDate, formatter), LocalTime.of(0, 0, 0));
            endDateTime = LocalDateTime.of(LocalDate.parse(endDate, formatter), LocalTime.of(23, 59, 59));
        }
        List<ResrcUtilization> resrcUtils = resrcUtilizationService.getResrcUtilizationByVersionAndDate(versionCd, plantCds, startDateTime, endDateTime);
        Map<String, Object> result = new HashMap<>();
        if (resrcUtils == null || resrcUtils.isEmpty()) {
            result.put("header", Collections.emptyList());
            result.put("data", Collections.emptyList());
            return result;
        }

        String decimalPlace = "1";
        Setting setting = settingService.getSettingBySettingCd(FP_DECIMAL_PLACE);
        if (setting != null) {
            decimalPlace = setting.getSettingVal();
        }

        List<ResourceUtilizationCrosstab> crosstabData = new ArrayList<>();
        List<String> dateHeader = makeDateHeader(startDateTime.toLocalDate(), endDateTime.toLocalDate());

        Function<ResrcUtilization, List<Object>> groupColumns = ru -> Arrays.asList(ru.getPlantCode(), ru.getStageCode(), ru.getResourceCode());
        Collection<List<ResrcUtilization>> groupingList = resrcUtils
                .stream()
                .sorted(Comparator.comparing(ResrcUtilization::getPlantCode).thenComparing(ResrcUtilization::getStageCode).thenComparing(ResrcUtilization::getResourceCode))
                .collect(Collectors.groupingBy(groupColumns, LinkedHashMap::new, Collectors.toList()))
                .values();

        for (List<ResrcUtilization> group : groupingList) {
            Object[] utilizationRates = new Object[dateHeader.size()];
            Object[] usedTms = new Object[dateHeader.size()];
            Object[] availTms = new Object[dateHeader.size()];
            for (ResrcUtilization ru : group) {
                int index = getHeaderIndex(ru.getStartTs(), dateHeader);
                double usedTm = toMinutes(ru.getUsedTm(), ru.getTimeUom());
                double availTm = toMinutes(ru.getAvailTm(), ru.getTimeUom());
                if (usedTm != 0 && availTm != 0) {
                    utilizationRates[index] = String.format("%." + decimalPlace + "f", (usedTm / availTm) * 100);
                }
                usedTms[index] = usedTm;
                availTms[index] = availTm;
            }

            ResrcUtilization first = group.get(0);
            ResourceUtilizationCrosstab.ResourceUtilizationCrosstabBuilder builder = ResourceUtilizationCrosstab.builder()
                    .plantCd(first.getPlantCode()).plantNm(first.getPlantName()).stageCd(first.getStageCode())
                    .stageNm(first.getStageName()).resourceCd(first.getResourceCode()).resourceNm(first.getResourceName());

            crosstabData.add(builder.analysisIndicator(FP_UTILIZATION).pivotData(utilizationRates).build());
            crosstabData.add(builder.analysisIndicator(FP_USED_TM).pivotData(usedTms).build());
            crosstabData.add(builder.analysisIndicator(FP_AVAIL_TM).pivotData(availTms).build());
        }

        result.put("header", dateHeader);
        result.put("data", crosstabData);

        return result;
    }

    private List<String> makeDateHeader(LocalDate startDate, LocalDate endDate) {
        List<String> dateHeaders = new ArrayList<>();
        endDate = endDate.plusDays(1);
        for (LocalDate date = startDate; date.isBefore(endDate); date = date.plusDays(1)) {
            String dateHeader = date.format(DateTimeFormatter.ofPattern(DATE_PATTERN_WITH_HYPHENS));
            dateHeaders.add(dateHeader);
        }
        return dateHeaders;
    }

    private int getHeaderIndex(LocalDateTime currentDateTime, List<String> header) {
        String currentDate = currentDateTime.format(DateTimeFormatter.ofPattern(DATE_PATTERN_WITH_HYPHENS));
        return header.indexOf(currentDate);
    }

    private static double toMinutes(double time, String timeUom) {
        double minutes = time;
        switch (timeUom) {
            case "SECOND":
                minutes = time / 60; break;
            case "HOUR":
                minutes = time * 60; break;
            case "DAY":
                minutes = time * 60 * 24; break;
            case "WEEK":
                minutes = time * 60 * 24 * 7; break;
            case "MONTH":
                minutes = time * 60 * 24 * 30; break;
        }
        return minutes;
    }

}
