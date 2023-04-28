package com.zionex.t3series.web.domain.fp.plan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanPolicyRepository extends JpaRepository<PlanPolicy, String> {

    PlanPolicy findByPolicyCd(String policyCd);
    
}
