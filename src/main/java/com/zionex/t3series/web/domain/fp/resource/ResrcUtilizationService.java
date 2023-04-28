package com.zionex.t3series.web.domain.fp.resource;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResrcUtilizationService {

    private final ResrcUtilizationRepository resrcUtilizationRepository;

    public List<ResrcUtilization> getResrcUtilizationByVersionAndDate(String versionCd, List<String> plantCds, LocalDateTime startTs, LocalDateTime endTs) {
        return resrcUtilizationRepository.findByVersionCdAndPlant_PlantCdInAndStartTsBetween(versionCd, plantCds, startTs, endTs);
    }

    public List<ResrcUtilization> getResrcUtilizationByVersionCdsAndDate(List<String> versionCds, LocalDateTime startTs, LocalDateTime endTs) {
        return resrcUtilizationRepository.findByVersionCdInAndStartTsBetweenOrderByVersionCd(versionCds, startTs, endTs);
    }

}
