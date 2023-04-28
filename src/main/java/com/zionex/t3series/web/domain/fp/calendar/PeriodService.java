package com.zionex.t3series.web.domain.fp.calendar;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PeriodService {
    
    private final PeriodRepository periodRepository;
    
    public void savePeriod(Period period) {
        periodRepository.save(period);
    }
    
    public Period getPeriodByPeriodCd(String periodCd) {
        return periodRepository.findByPeriodCd(periodCd);
    }
    
}
