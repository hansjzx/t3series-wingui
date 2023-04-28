package com.zionex.t3series.web.domain.fp.plan;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanProblemRepository extends JpaRepository<PlanProblem, String> {

    List<PlanProblem> findByVersionCdAndPlantCdIn(String versionCd, List<String> plantCds);

}
