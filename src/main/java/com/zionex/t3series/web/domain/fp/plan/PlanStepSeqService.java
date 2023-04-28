package com.zionex.t3series.web.domain.fp.plan;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlanStepSeqService {

    private final PlanStepSeqRepository planStepSeqRepository;
    
    public PlanStepSeq getPlanStepSeqByStepCdAndSeq(String stepCd, Long stepSeq) {
        return planStepSeqRepository.findByStepCdAndStepSeq(stepCd, stepSeq);
    }

    public List<PlanStepSeq> getPlanStepSeqsByStepCd(String stepCd) {
        return planStepSeqRepository.findByStepCdOrderByStepSeq(stepCd);
    }

    public void savePlanStepSeqs(List<PlanStepSeq> planStepSeq) {
        planStepSeqRepository.saveAll(planStepSeq);        
    }

    public void deletePlanStepSeqs(List<PlanStepSeq> planStepSeq) {
        planStepSeqRepository.deleteAll(planStepSeq);        
    }

}
