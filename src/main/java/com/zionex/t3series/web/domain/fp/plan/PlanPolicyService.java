package com.zionex.t3series.web.domain.fp.plan;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlanPolicyService {

    private final PlanPolicyRepository planPolicyRepository;

    public PlanPolicy getPlanPolicyByPolicyCd(String policyCd) {
        return planPolicyRepository.findByPolicyCd(policyCd);
    }

    public List<PlanPolicy> getPlanPolicies() {
        return planPolicyRepository.findAll();        
    }

    public void savePlanPolicy(PlanPolicy planPolicy) {
        planPolicyRepository.save(planPolicy);
    }
    
}
