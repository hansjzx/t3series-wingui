package com.zionex.t3series.web.domain.fp.plan;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlanProblemService {

    private final PlanProblemRepository planProblemRepository;

    public List<PlanProblem> getPlanProblems(String versionCd, List<String> plantCds) {
        return planProblemRepository.findByVersionCdAndPlantCdIn(versionCd, plantCds);
    }
    
}
