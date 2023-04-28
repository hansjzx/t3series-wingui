package com.zionex.t3series.web.domain.fp.organization;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlantService {

    private final PlantRepository plantRepository;

    public List<Plant> getPlants() {
        return plantRepository.findAll();
    }

}
