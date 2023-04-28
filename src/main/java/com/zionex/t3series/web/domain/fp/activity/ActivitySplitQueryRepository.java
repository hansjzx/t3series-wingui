package com.zionex.t3series.web.domain.fp.activity;

import static com.zionex.t3series.web.domain.fp.activity.QActivity.activity;
import static com.zionex.t3series.web.domain.fp.activity.QActivitySplit.activitySplit;
import static com.zionex.t3series.web.domain.fp.organization.QPlant.plant;
import static com.zionex.t3series.web.domain.fp.resource.QResource.resource;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import com.microsoft.sqlserver.jdbc.StringUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zionex.t3series.web.domain.fp.result.PlanResult;
import com.zionex.t3series.web.domain.fp.result.PlanResult.PlanResultDetail;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ActivitySplitQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public List<PlanResult> getPlanResults(String versionCd, List<String> plantCds) {
        return jpaQueryFactory
                .select(Projections.fields(PlanResult.class,
                        activitySplit.plantCd,
                        plant.plantNm,
                        activitySplit.resourceCd,
                        resource.resourceNm.coalesce(activitySplit.resourceCd).as("resourceNm"),
                        activitySplit.itemCd,
                        activity.itemNm,
                        activity.itemUom,
                        activitySplit.qty,
                        activitySplit.startTs))
                .from(activitySplit)
                .innerJoin(activity)
                .on(activitySplit.versionCd.eq(activity.versionCd)
                        .and(activitySplit.plantCd.eq(activity.plantCd))
                        .and(activitySplit.stageCd.eq(activity.stageCd))
                        .and(activitySplit.activityId.eq(activity.activityId)))
                .leftJoin(plant).on(activitySplit.plantCd.eq(plant.plantCd))
                .leftJoin(resource).on(activitySplit.resourceCd.eq(resource.resourceCd))
                .where(activitySplit.versionCd.eq(versionCd)
                        .and(activitySplit.plantCd.in(plantCds)))
                .orderBy(activitySplit.plantCd.asc(), activitySplit.resourceCd.asc(), activitySplit.itemCd.asc(),
                        activitySplit.qty.asc(), activitySplit.startTs.asc())
                .fetch();
    }

    public List<PlanResultDetail> getPlanResultsDetail(String versionCd, String plantCd, String resourceCd, String itemCd, LocalDateTime startDate) {
        return jpaQueryFactory
                .select(Projections.fields(PlanResultDetail.class,
                        activity.woCd,
                        activity.plantCd,
                        activity.resourceCd,
                        activity.itemCd,
                        activitySplit.qty.as("planQty"),
                        activity.qty.as("totalQty"),
                        activity.startTs.as("totalStart"),
                        activity.endTs.as("totalEnd")))
                .from(activitySplit)
                .innerJoin(activity)
                .on(activitySplit.versionCd.eq(activity.versionCd)
                        .and(activitySplit.plantCd.eq(activity.plantCd))
                        .and(activitySplit.stageCd.eq(activity.stageCd))
                        .and(activitySplit.activityId.eq(activity.activityId)))
                .where(activitySplit.versionCd.eq(versionCd)
                        .and(activitySplit.plantCd.like(replaceIsNull(plantCd)))
                        .and(activitySplit.resourceCd.like(replaceIsNull(resourceCd)))
                        .and(activitySplit.itemCd.like(replaceIsNull(itemCd)))
                        .and(activitySplit.startTs.between(startDate, startDate.with(LocalTime.MAX).withNano(0))))
                .orderBy(activity.startTs.asc(), activity.endTs.asc())
                .fetch();
    }

    public String replaceIsNull(String param) {
        if (StringUtils.isEmpty(param)) {
            return "%%";
        } else {
            return param;
        }
    }

}
