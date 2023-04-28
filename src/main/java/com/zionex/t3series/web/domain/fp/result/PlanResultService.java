package com.zionex.t3series.web.domain.fp.result;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import com.zionex.t3series.web.domain.fp.activity.ActivitySplitQueryRepository;
import com.zionex.t3series.web.domain.fp.result.PlanResult.PlanResultDetail;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlanResultService {

    private final ActivitySplitQueryRepository activitySplitQueryRepository;

    public List<PlanResult> getPlanResults(String versionCd, List<String> plantCds) {
        return activitySplitQueryRepository.getPlanResults(versionCd, plantCds);
    }

    public List<PlanResultDetail> getPlanResultsDetail(String versionCd, String plantCd, String resourceCd, String itemCd, String startDate) {
        LocalDateTime startDateTime = LocalDateTime.of(LocalDate.parse(startDate, DateTimeFormatter.ofPattern("yyyy-MM-dd")), LocalTime.of(0, 0, 0));
        return activitySplitQueryRepository.getPlanResultsDetail(versionCd, plantCd, resourceCd, itemCd, startDateTime);
    }

}
