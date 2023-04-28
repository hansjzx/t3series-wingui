package com.zionex.t3series.web.domain.fp.calendar;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CalendarMstService {

    private final CalendarMstRepository calendarMstRepository;

    public void saveCalendarMsts(List<CalendarMst> calendarMsts) {
        calendarMstRepository.saveAll(calendarMsts);
    }

    public void saveCalendarMst(CalendarMst calendarMst) {
        calendarMstRepository.save(calendarMst);
    }
    
}
