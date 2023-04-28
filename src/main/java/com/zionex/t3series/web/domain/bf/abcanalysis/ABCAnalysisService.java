package com.zionex.t3series.web.domain.bf.abcanalysis;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ABCAnalysisService {
    
    @Autowired
    private ABCAnalysisRepository abcAnalysisRepository;

    public void saveItemAccountModelMap(List<ABCAnalysis> itemAccountMaps) {
        itemAccountMaps.forEach(row -> {
            row.setActiveYN("Y");
        });

        abcAnalysisRepository.saveAll(itemAccountMaps);
    }

    public void truncate() {
        abcAnalysisRepository.truncate();
    }
}