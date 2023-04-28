package com.zionex.t3series.web.domain.fp.calendar;

import static com.zionex.t3series.web.domain.fp.calendar.QCalendarDtl.calendarDtl;
import static com.zionex.t3series.web.domain.fp.calendar.QCalendarMst.calendarMst;
import static com.zionex.t3series.web.domain.fp.calendar.QPeriod.period;
import static com.zionex.t3series.web.domain.fp.resource.QResource.resource;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zionex.t3series.web.domain.fp.master.CalendarResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PeriodQueryRepository {
    
    private final JPAQueryFactory jpaQueryFactory;
    
    public List<CalendarResult> getEvents(String resourceParam) {
        return jpaQueryFactory
                .select(Projections.fields(CalendarResult.class,
                    period.startTs.as("start"),
                    period.endTs.as("end"),
                    period.descTxt.as("title"),
                    period.cycleTpCd.as("cycleTp"),
                    calendarDtl.displayColor,
                    calendarDtl.calendarTpCd.as("calendarTp"),
                    calendarDtl.priority,
                    resource.calendarCd,
                    resource.resourceCd,
                    period.periodCd
                ))
                .from(period)
                .join(resource).on(resource.resourceCd.eq(resourceParam))
                .join(calendarMst).on(resource.calendarCd.eq(calendarMst.calendarCd))
                .join(calendarDtl).on(resource.calendarCd.eq(calendarDtl.calendarCd)
                        .and(calendarDtl.periodCd.eq(period.periodCd)))
                .fetch();
    }
    
}
