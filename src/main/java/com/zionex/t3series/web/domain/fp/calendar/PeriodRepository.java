package com.zionex.t3series.web.domain.fp.calendar;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PeriodRepository extends JpaRepository<Period, String> {
    
    Period findByPeriodCd(String periodCd);
    
}
