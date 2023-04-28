package com.zionex.t3series.web.domain.fp.plan;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanPolicyDetailRepository extends JpaRepository<PlanPolicyDetail, String> {

    List<PlanPolicyDetail> findByPolicyCd(String policyCd);

    @Transactional  
    void deleteAllByPolicyCd(String policyCd);
    
}
