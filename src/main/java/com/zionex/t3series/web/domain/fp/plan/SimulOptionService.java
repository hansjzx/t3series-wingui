package com.zionex.t3series.web.domain.fp.plan;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SimulOptionService {
    
    private final SimulOptionRepository simulOptionRepository;
    
    public List<SimulOption> getSimulOptionsByVersionCd(String versionCd) {
        return simulOptionRepository.findByVersionCd(versionCd);
    }
    
    public void saveSimulOptions(List<SimulOption> simulOptions) {
        simulOptionRepository.saveAll(simulOptions);
    }
    
}
