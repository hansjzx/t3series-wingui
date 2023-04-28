package com.zionex.t3series.web.domain.bf.abcanalysis;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SalesStatsService {
    @Autowired
    private SalesStatsRepository salesStatsRepository;

    public Map<String, Object> selectDistinctThld() {
        Map<String, Object> res = salesStatsRepository.findAllDistinctData();
        
        return res;
    }
}
