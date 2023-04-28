package com.zionex.t3series.web.domain.fp.plan;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanVersionRepository extends JpaRepository<PlanVersion, String> {

    PlanVersion findByVersionCd(String versionCd);

    PlanVersion findTopByMainVersionCdOrderByVersionSeqDesc(String mainVersionCd);
    
    List<PlanVersion> findByPlanDtOrderByVersionSeqDesc(LocalDate planningDate);
    
    List<PlanVersion> findByMainVersionCdOrderByVersionSeqDesc(String mainVersionCd);
    
    List<PlanVersion> findByMainVersionCdInOrderByVersionSeqDesc(List<String> mainVersionCds);
    
}
