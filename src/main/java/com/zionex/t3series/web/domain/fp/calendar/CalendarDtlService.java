package com.zionex.t3series.web.domain.fp.calendar;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CalendarDtlService {
    
    private final CalendarDtlRepository calendarDtlRepository;
    
    public List<CalendarDtl> getCalendarDtlsByCalendarCd(String calendarCd) {
        return calendarDtlRepository.findByCalendarCd(calendarCd);
    }
    
    public CalendarDtl getCalendarDtlByCalendarCdAndPeriodCd(String calendarCd, String periodCd) {
        return calendarDtlRepository.findByCalendarCdAndPeriodCd(calendarCd, periodCd);
    }
    
    public void saveCalendarDtls(List<CalendarDtl> calendarDtls) {
        calendarDtlRepository.saveAll(calendarDtls);
    }

    public void saveCalendarDtl(CalendarDtl calendarDtl) {
        calendarDtlRepository.save(calendarDtl);
    }
    
}
