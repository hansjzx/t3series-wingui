package com.zionex.t3series.web.domain.fp.order;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WoPlanService {

    private final WoPlanRepository woPlanRepository;

    public List<WoPlan> getWorkOrderPlans(String versionCd, List<String> plantCds) {
        return woPlanRepository.findByVersionCdAndPlantCdIn(versionCd, plantCds);
    }

    public List<WoPlan> getWorkOrderPlansByVersionCds(List<String> versionCds) {
        return woPlanRepository.findByVersionCdInOrderByVersionCd(versionCds);
    }

}
