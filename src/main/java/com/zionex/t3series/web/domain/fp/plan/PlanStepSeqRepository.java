package com.zionex.t3series.web.domain.fp.plan;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanStepSeqRepository extends JpaRepository<PlanStepSeq, String> {

    List<PlanStepSeq> findByStepCdOrderByStepSeq(String stepCd);
    
    PlanStepSeq findByStepCdAndStepSeq(String stepCd, Long stepSeq);
    
}
