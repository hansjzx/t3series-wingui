package com.zionex.t3series.web.domain.fp.plan;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlanPolicyDetailService {

    private final PlanPolicyDetailRepository planPolicyDetailRepository;

    public List<PlanPolicyDetail> getPlanPolicyDetails(String policyCd) {
        return planPolicyDetailRepository.findByPolicyCd(policyCd);
    }

    public void savePlanPolicyDetails(List<PlanPolicyDetail> planPolicyDetails) {
        planPolicyDetailRepository.saveAll(planPolicyDetails);        
    }
    
    public void deletePlanPolicyDetails(String policyCd) {
        planPolicyDetailRepository.deleteAllByPolicyCd(policyCd);        
    }

}
