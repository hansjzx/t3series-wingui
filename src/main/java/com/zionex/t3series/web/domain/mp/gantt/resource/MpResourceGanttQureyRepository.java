package com.zionex.t3series.web.domain.mp.gantt.resource;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Repository;

import static com.zionex.t3series.web.domain.mp.gantt.resource.QConbdMainVerDtl.conbdMainVerDtl;
import static com.zionex.t3series.web.domain.mp.gantt.resource.QConbdMainVerMst.conbdMainVerMst;
import static com.zionex.t3series.web.domain.mp.gantt.resource.QHorizonTimeBucket.horizonTimeBucket;
import static com.zionex.t3series.web.domain.mp.gantt.resource.QMpResourceGantt.mpResourceGantt;
import static com.zionex.t3series.web.domain.mp.gantt.resource.QMpResourceHolidays.mpResourceHolidays;
import static com.zionex.t3series.web.domain.mp.gantt.resource.QLocMgmt.locMgmt;
import static com.zionex.t3series.web.domain.mp.gantt.resource.QLocDtl.locDtl;
import static com.zionex.t3series.web.domain.mp.gantt.resource.QLocMst.locMst;
import static com.zionex.t3series.web.domain.mp.gantt.resource.QComnCode.comnCode;


import java.util.List;

@Repository
@RequiredArgsConstructor
public class MpResourceGanttQureyRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public MpPlanHorizon getPlanHorizon(String simulVer) {
        QUom uom1 = new QUom("uom1");
        QUom uom2 = new QUom("uom2");

        List<MpPlanHorizon> content = jpaQueryFactory
                .select(Projections.fields(MpPlanHorizon.class,
                    conbdMainVerDtl.simulVerId,
                    uom1.uomCd.as("baseBucketUom"),
                    uom2.uomCd.as("resCd"),
                    horizonTimeBucket.strtDate.as("zone1Start"),
                    horizonTimeBucket.strtDate2.as("zone2Start"),
                    horizonTimeBucket.endDate.as("endTime"),
                    horizonTimeBucket.descrip
                ))
                .from(conbdMainVerDtl)
                .leftJoin(conbdMainVerMst).on(conbdMainVerMst.id.eq(conbdMainVerDtl.conbdMainVerMstId))
                .leftJoin(horizonTimeBucket).on(horizonTimeBucket.planSnrioMgmtMstId.eq(conbdMainVerMst.planSnrioMgmtMstId))
                .leftJoin(uom1).on(uom1.id.eq(horizonTimeBucket.timeUomId))
                .leftJoin(uom2).on(uom2.id.eq(horizonTimeBucket.varTimeUomId))
                .where(conbdMainVerDtl.simulVerId.eq(simulVer))
                .fetch();

        if (content.size() != 0) {
            return content.get(0);
        }

        return null;
    }

    
    public List<MpResourceGanttData> getActivities(String mainVerId) {
        List<MpResourceGanttData> content = jpaQueryFactory
        .select(Projections.fields(MpResourceGanttData.class,
            mpResourceGantt.id,
            mpResourceGantt.resourceId,
            mpResourceGantt.routeId,
            mpResourceGantt.inventoryId,
            mpResourceGantt.dmndId,
            mpResourceGantt.planorderId,
            mpResourceGantt.activityId,
            mpResourceGantt.bucketStrtDate,
            mpResourceGantt.bucketEndDate,
            mpResourceGantt.strtDate,
            mpResourceGantt.endDate,
            mpResourceGantt.color,
            mpResourceGantt.qty,
            mpResourceGantt.actHeight,
            mpResourceGantt.displaySeq
        ))
        .from(mpResourceGantt)
        .innerJoin(conbdMainVerDtl).on(conbdMainVerDtl.id.eq(mpResourceGantt.conbdMainVerDtlId))
        .innerJoin(locDtl).on(locDtl.locatCd.eq(mpResourceGantt.inventoryId.substring(mpResourceGantt.inventoryId.indexOf("@").add(1), mpResourceGantt.inventoryId.length())))
        .innerJoin(locMgmt).on(locMgmt.locatId.eq(locDtl.id))
        .innerJoin(locMst).on(locMst.id.eq(locDtl.locatMstId))
        .innerJoin(comnCode).on(comnCode.id.eq(locMst.locatTpId))
        .where(conbdMainVerDtl.id.eq(mainVerId))
        .orderBy(mpResourceGantt.displaySeq.desc(), comnCode.seq.desc(), mpResourceGantt.resourceId.asc())
        .fetch();

        return content;
    }

    public MpResourceGanttDetail getActivityDetail(String id) {
        List<MpResourceGanttDetail> content = jpaQueryFactory
        .select(Projections.fields(MpResourceGanttDetail.class,
            mpResourceGantt.id,
            mpResourceGantt.routeId,
            mpResourceGantt.activityId,
            mpResourceGantt.qty
        ))
        .from(mpResourceGantt)
        .where(mpResourceGantt.id.eq(id))
        .fetch();

        if (content.size() != 0) {
            return content.get(0);
        }

        return null;
    }

    public List<MpResourceHoliday> getResourceHolidays(String mainVerId) {
        List<MpResourceHoliday> content = jpaQueryFactory
        .select(Projections.fields(MpResourceHoliday.class,
            mpResourceGantt.resourceId,
            mpResourceHolidays.strtDate,
            mpResourceHolidays.endDate
        ))
        .from(mpResourceGantt)
        .innerJoin(mpResourceHolidays).on(mpResourceHolidays.resourceId.eq(mpResourceGantt.resourceId))
        .where(mpResourceGantt.id.eq(mainVerId))
        .fetch();

        return content;
    }

}
