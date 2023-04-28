package com.zionex.t3series.web.domain.fp.organization;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SiteService {

    private final SiteRepository siteRepository;

    public List<Site> getSites() {
        return siteRepository.findAll();
    }

}
