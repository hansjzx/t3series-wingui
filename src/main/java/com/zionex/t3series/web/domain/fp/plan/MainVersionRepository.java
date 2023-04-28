package com.zionex.t3series.web.domain.fp.plan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MainVersionRepository extends JpaRepository<MainVersion, String> {
    
    MainVersion findTopByPlanDtOrderByVersionSeqDesc(LocalDate planDate);
    
    List<MainVersion> findByPlanDtOrderByVersionSeqDesc(LocalDate planDate);
    
    MainVersion findByMainVersionCd(String mainVersionCd);
    
    boolean existsByMainVersionCd(String mainVersionCd);
    
}
