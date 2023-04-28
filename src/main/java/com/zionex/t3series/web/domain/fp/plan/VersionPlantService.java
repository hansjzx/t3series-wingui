package com.zionex.t3series.web.domain.fp.plan;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VersionPlantService {

    private final VersionPlantRepository versionPlantRepository;

    public List<VersionPlant> getVersionPlantsByVersion(String versionCd) {
        return versionPlantRepository.findByVersionCd(versionCd);
    }

    public void saveVersionPlants(List<VersionPlant> versionPlants) {
        versionPlantRepository.saveAll(versionPlants);
    }

}
