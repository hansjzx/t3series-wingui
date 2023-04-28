package com.zionex.t3series.web.domain.fp.result;

import java.util.List;

import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.domain.fp.result.PlanResult.PlanResultDetail;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/plan-result/")
public class PlanResultController {

    private final PlanResultService planResultService;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("versions/{version-cd}")
    public List<PlanResult> getPlanResults(@PathVariable("version-cd") String versionCd, @RequestParam(value = "plant-cds", required = false) List<String> plantCds) {
        return planResultService.getPlanResults(versionCd, plantCds);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("versions/{version-cd}/detail")
    public List<PlanResultDetail> getPlanResultsDetail(@PathVariable("version-cd") String versionCd, @RequestParam("plant-cd") String plantCd,
                                                       @RequestParam("resource-cd") String resourceCd, @RequestParam("item-cd") String itemCd,
                                                       @RequestParam("start-date") String startDate) {
        return planResultService.getPlanResultsDetail(versionCd, plantCd, resourceCd, itemCd, startDate);
    }

}
