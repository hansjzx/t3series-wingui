package com.zionex.t3series.web.domain.fp.analysis;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.domain.fp.plan.PlanProblem;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/problem-analysis/")
public class ProblemAnalysisController {

    private final ProblemAnalysisService problemAnalysisService;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("versions/{version-cd}/problem-status")
    public Map<String, Map<String, Long>> getProblemStatus(@PathVariable("version-cd") String versionCd, @RequestParam("plant-cds") List<String> plantCds) {
        return problemAnalysisService.getProblemStatus(versionCd, plantCds);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("versions/{version-cd}/problem-status/detail")
    public List<PlanProblem> getProblemStatusDetail(@PathVariable("version-cd") String versionCd, @RequestParam("plant-cds") List<String> plantCds) {
        return problemAnalysisService.getProblemStatusDetail(versionCd, plantCds);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("versions/{version-cd}/kpi")
    public KPIResult getKPI(@PathVariable("version-cd") String versionCd, @RequestParam("plant-cds") List<String> plantCds) {
        return problemAnalysisService.getKPI(versionCd, plantCds);
    }

}
