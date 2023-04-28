package com.zionex.t3series.web.domain.fp.plan;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlanStepService {

    private final PlanStepRepository planStepRepository;

    public List<PlanStep> getPlanSteps() {
        return planStepRepository.findAll();
    }
    
    public void savePlanStep(PlanStep planStep) {
        planStepRepository.save(planStep);
    }

}
