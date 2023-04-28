package com.zionex.t3series.web.domain.fp.resource;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResrcDowntimeService {

    private final ResrcDowntimeRepository resrcDowntimeRepository;

    public List<ResrcDowntime> getResrcDowntimesByVersionCdAndPlantCds(String versionCd, List<String> plantCds) {
        return resrcDowntimeRepository.findByVersionCdAndPlantCdInOrderByPlantCdAscResourceCdAscStageCdAscEndTsAsc(versionCd, plantCds);
    }

}
