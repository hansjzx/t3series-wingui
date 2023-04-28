package com.zionex.t3series.web.domain.fp.calendar;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarDtlRepository extends JpaRepository<CalendarDtl, String> {
    
    List<CalendarDtl> findByCalendarCd(String calendarCd);
    
    CalendarDtl findByCalendarCdAndPeriodCd(String calendarCd, String periodCd);

}
