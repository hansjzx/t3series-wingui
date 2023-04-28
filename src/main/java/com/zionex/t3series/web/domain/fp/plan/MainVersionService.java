package com.zionex.t3series.web.domain.fp.plan;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MainVersionService {
    
    private final MainVersionRepository mainVersionRepository;
    
    public MainVersion getLastMainVersion(LocalDate planDate) {
        return mainVersionRepository.findTopByPlanDtOrderByVersionSeqDesc(planDate);
    }
    
    public List<MainVersion> getMainVersionsByPlanDt(LocalDate planningDate) {
        return mainVersionRepository.findByPlanDtOrderByVersionSeqDesc(planningDate);
    }
    
    public MainVersion getMainVersionByVersionCd(String versionCd) {
        return mainVersionRepository.findByMainVersionCd(versionCd);
    }
    
    public boolean existsByMainVersionCd(String mainVersionCd) {
        return mainVersionRepository.existsByMainVersionCd(mainVersionCd);
    }
    
    public void saveMainVersion(MainVersion mainVersion) {
        mainVersionRepository.save(mainVersion);
    }
    
}
