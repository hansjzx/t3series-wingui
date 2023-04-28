package com.zionex.t3series.web.domain.fp.plan;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanHistoryService {
    
    private final PlanHistoryRepository planHistoryRepository;
    
    public PlanHistory savePlanHistory(PlanHistory planHistory) {
        return planHistoryRepository.save(planHistory);
    }
    
    public PlanHistory getPlanHistoryByVersionCd(String versionCd) {
        return planHistoryRepository.findByVersionCd(versionCd);
    }
    
    public List<PlanHistory> getSimulationHistories() {
        return planHistoryRepository.findAll();
    }
    
    public List<PlanHistory> getSimulationHistoriesByMainVersionCd(String mainVersionCd) {
        return planHistoryRepository.findByMainVersionCd(mainVersionCd);
    }
    
}
