package com.zionex.t3series.web.domain.fp.plan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanHistoryRepository extends JpaRepository<PlanHistory, String> {
    
    PlanHistory findByVersionCd(String versionCd);
    
    List<PlanHistory> findByMainVersionCd(String mainVersionCd);
    
}
