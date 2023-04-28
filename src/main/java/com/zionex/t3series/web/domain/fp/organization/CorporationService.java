package com.zionex.t3series.web.domain.fp.organization;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CorporationService {

    private final CorporationRepository corporationRepository;

    public List<Corporation> getCorporations() {
        return corporationRepository.findAll();
    }

}
