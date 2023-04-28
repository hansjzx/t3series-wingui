package com.zionex.t3series.web.domain.fp.organization;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StageService {

    private final StageRepository stageRepository;

    public List<Stage> getStages() {
        return stageRepository.findAll();
    }

}
