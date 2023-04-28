package com.zionex.t3series.web.domain.fp.plan;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlanVersionService {

    private final PlanVersionRepository planVersionRepository;
    
    public List<PlanVersion> getPlanVersionsByPlanDt(LocalDate planningDate) {
        return planVersionRepository.findByPlanDtOrderByVersionSeqDesc(planningDate);
    }

    public PlanVersion getPlanVersionByVersionCd(String versionCd) {
        return planVersionRepository.findByVersionCd(versionCd);
    }

    public List<PlanVersion> getPlanVersionsByMainVersionCd(String mainVersionCd) {
        return planVersionRepository.findByMainVersionCdOrderByVersionSeqDesc(mainVersionCd);
    }

    public PlanVersion getLastPlanVersionByMainVersionCd(String mainVersionCd) {
        return planVersionRepository.findTopByMainVersionCdOrderByVersionSeqDesc(mainVersionCd);
    }

    public List<PlanVersion> getPlanVersionsByMainVersions(List<String> mainVersions) {
        return planVersionRepository.findByMainVersionCdInOrderByVersionSeqDesc(mainVersions);
    }

    public void savePlanVersion(PlanVersion planVersion) {
        planVersionRepository.save(planVersion);
    }

    public void savePlanVersions(List<PlanVersion> planVersions) {
        planVersionRepository.saveAll(planVersions);
    }

}
