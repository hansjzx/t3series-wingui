package com.zionex.t3series.web.domain.fp.activity;

import static com.zionex.t3series.web.domain.fp.activity.QActivity.activity;
import static com.zionex.t3series.web.domain.fp.activity.QActivityRelation.activityRelation;
import static com.zionex.t3series.web.domain.fp.customer.QCustomer.customer;
import static com.zionex.t3series.web.domain.fp.item.QItem.item;
import static com.zionex.t3series.web.domain.fp.order.QSalesOrder.salesOrder;
import static com.zionex.t3series.web.domain.fp.order.QWoPlan.woPlan;
import static com.zionex.t3series.web.domain.fp.organization.QPlant.plant;
import static com.zionex.t3series.web.domain.fp.resource.QResource.resource;
import static com.zionex.t3series.web.domain.fp.resource.QResrcDowntime.resrcDowntime;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zionex.t3series.web.domain.fp.gantt.resource.ActivityDetail;
import com.zionex.t3series.web.domain.fp.gantt.resource.ActivityDivisibleYDowntime;
import com.zionex.t3series.web.domain.fp.gantt.resource.ResourceGanttResult.ActivityInfo;
import com.zionex.t3series.web.domain.fp.result.OrderTrackingResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ActivityQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public List<Activity> getActivitiesWithJcTime(String versionCd, List<String> plantCds) {
        return jpaQueryFactory
                .select(activity)
                .from(activity)
                .join(resource).on(activity.resourceCd.eq(resource.resourceCd))
                .where(activity.versionCd.eq(versionCd)
                        .and(activity.plantCd.in(plantCds))
                        .and(activity.prevJcTm.gt(0.0).or(activity.nextJcTm.gt(0.0)))
                )
                .fetch();
    }

    public List<ActivityInfo> getActivities(String versionCd, List<String> plantCds) {
        return jpaQueryFactory
                .select(Projections.fields(ActivityInfo.class,
                        activity.plantCd,
                        plant.plantNm,
                        activity.resourceCd,
                        resource.resourceNm,
                        activity.activityId,
                        activity.startTs,
                        activity.endTs,
                        woPlan.displayColor.coalesce(activity.displayColor).as("displayColor"),
                        woPlan.lateYn,
                        activity.qty,
                        activity.itemCd,
                        activity.itemNm,
                        activity.woCd,
                        activity.prevJcTm,
                        activity.nextJcTm,
                        activity.prevJcStartTs,
                        activity.prevJcEndTs,
                        activity.nextJcStartTs,
                        activity.nextJcEndTs
                ))
                .from(activity)
                .leftJoin(resource).on(activity.resourceCd.eq(resource.resourceCd))
                .leftJoin(woPlan).on(activity.versionCd.eq(woPlan.versionCd).and(activity.woCd.eq(woPlan.woCd)))
                .leftJoin(plant).on(activity.plantCd.eq(plant.plantCd))
                .where(activity.versionCd.eq(versionCd).and(activity.plantCd.in(plantCds)))
                .orderBy(resource.displaySeq.asc(), activity.resourceCd.asc(), activity.startTs.asc(), activity.endTs.asc())
                .fetch();
    }

    public List<ActivityDivisibleYDowntime> getDivisibleYDowntime(String versionCd, List<String> plantCds) {
        return jpaQueryFactory
                .select(Projections.fields(ActivityDivisibleYDowntime.class,
                        activity.resourceCd,
                        activity.activityId,
                        activity.woCd,
                        resrcDowntime.startTs.as("downStart"),
                        resrcDowntime.endTs.as("downEnd")
                ))
                .from(activity)
                .join(resrcDowntime).on(activity.versionCd.eq(resrcDowntime.versionCd)
                        .and(activity.plantCd.eq(resrcDowntime.plantCd))
                        .and(activity.resourceCd.eq(resrcDowntime.resourceCd))
                        .and(activity.startTs.before(resrcDowntime.startTs).and(resrcDowntime.endTs.before(activity.endTs))))
                .where(activity.versionCd.eq(versionCd).and(activity.plantCd.in(plantCds)).and(activity.divideTpCd.eq("Y")))
                .orderBy(activity.plantCd.asc(), activity.resourceCd.asc(), resrcDowntime.startTs.asc(), resrcDowntime.endTs.asc())
                .fetch();
    }

    public ActivityDetail getWorkDetail(String versionCd, String plantCd, String resourceCd, Long activityId) {
        return jpaQueryFactory
                .select(Projections.fields(ActivityDetail.class,
                        activity.itemCd.concat(" (").concat(activity.itemNm.coalesce("")).concat(")").as("itemCd"),
                        activity.qty.stringValue().concat(" (").concat(activity.itemUom.coalesce("")).concat(")").as("qty"),
                        activity.startTs,
                        activity.endTs,
                        activity.resourceCd.concat(" (").concat(resource.resourceNm.coalesce("")).concat(")").as("resourceCd"),
                        activity.routeCd.concat(" (").concat(activity.routeNm.coalesce("")).concat(")").as("routeCd"),
                        activity.wipYn
                ))
                .from(activity)
                .leftJoin(resource).on(activity.resourceCd.eq(resource.resourceCd))
                .where(versionCdEq(versionCd), plantCdEq(plantCd), resourceCdEq(resourceCd), activityIdEq(activityId))
                .fetchOne();
    }

    public ActivityDetail getOrderDetail(String versionCd, String plantCd, String resourceCd, Long activityId) {
        return jpaQueryFactory
                .select(Projections.fields(ActivityDetail.class,
                        activity.woCd,
                        woPlan.inventoryCd.concat(" (").concat(woPlan.inventoryNm.coalesce("")).concat(")").as("inventoryCd"),
                        woPlan.shptQty.stringValue().concat(" (").concat(woPlan.itemUom.coalesce("")).concat(")").as("shptQty"),
                        woPlan.dueDt,
                        woPlan.startTs.as("woStartTs"),
                        woPlan.endTs.as("woEndTs"),
                        woPlan.lateYn,
                        woPlan.planSeq,
                        woPlan.soCd,
                        salesOrder.requestQty.stringValue().coalesce("").asString().concat(" (").concat(item.itemUom.coalesce("")).concat(")").as("requestQty"),
                        salesOrder.customer.customerCd.coalesce("").asString().concat(" (").concat(customer.customerNm.coalesce("")).concat(")").as("customerCd")
                ))
                .from(activity)
                .leftJoin(woPlan).on(activity.versionCd.eq(woPlan.versionCd).and(activity.woCd.eq(woPlan.woCd)))
                .leftJoin(salesOrder).on(salesOrder.soCd.eq(woPlan.soCd))
                .leftJoin(item).on(item.itemCd.eq(salesOrder.inventory.inventoryCd))
                .leftJoin(customer).on(customer.customerCd.eq(salesOrder.customer.customerCd))
                .where(versionCdEq(versionCd), plantCdEq(plantCd), resourceCdEq(resourceCd), activityIdEq(activityId))
                .fetchOne();
    }

    public ActivityDetail getTooltip(String versionCd, String plantCd, String resourceCd, Long activityId) {
        return jpaQueryFactory
                .select(Projections.fields(ActivityDetail.class,
                        activity.itemCd.concat(" (").concat(activity.itemNm.coalesce("")).concat(")").as("itemCd"),
                        activity.qty.stringValue().concat(" (").concat(activity.itemUom.coalesce("")).concat(")").as("qty"),
                        activity.startTs,
                        activity.endTs,
                        activity.woCd,
                        woPlan.inventoryCd.concat(" (").concat(woPlan.inventoryNm.coalesce("")).concat(")").as("inventoryCd"),
                        woPlan.shptQty.stringValue().concat(" (").concat(woPlan.itemUom.coalesce("")).concat(")").as("shptQty"),
                        woPlan.dueDt
                ))
                .from(activity)
                .leftJoin(woPlan).on(activity.versionCd.eq(woPlan.versionCd).and(activity.woCd.eq(woPlan.woCd)))
                .where(versionCdEq(versionCd), plantCdEq(plantCd), resourceCdEq(resourceCd), activityIdEq(activityId))
                .fetchOne();
    }

    public List<OrderTrackingResult> getActivitiesTree(String versionCd, List<String> plantCds) {
        return jpaQueryFactory
                .select(Projections.fields(OrderTrackingResult.class,
                        activityRelation.nextActivityId.stringValue().trim().coalesce(activity.woCd).as("parent"),
                        activity.activityId.stringValue().trim().as("tree"),
                        activity.plantCd,
                        activity.woCd,
                        activity.itemCd,
                        activity.itemNm,
                        activity.routeCd,
                        activity.routeNm,
                        activity.resourceCd,
                        resource.resourceNm,
                        activity.itemUom.as("uom"),
                        activity.qty,
                        activity.displayColor,
                        activity.startTs,
                        activity.endTs
                ))
                .from(activity)
                .leftJoin(resource).on(activity.resourceCd.eq(resource.resourceCd))
                .leftJoin(activityRelation).on(activity.versionCd.eq(activityRelation.versionCd).and(activity.activityId.eq(activityRelation.prevActivityId)))
                .where(versionCdEq(versionCd), activity.plantCd.in(plantCds))
                .fetch();
    }

    private BooleanExpression versionCdEq(String versionCd) {
        return StringUtils.hasText(versionCd) ? activity.versionCd.eq(versionCd) : null;
    }

    private BooleanExpression plantCdEq(String plantCd) {
        return StringUtils.hasText(plantCd) ? activity.plantCd.eq(plantCd) : null;
    }

    private BooleanExpression resourceCdEq(String resourceCd) {
        return StringUtils.hasText(resourceCd) ? activity.resourceCd.eq(resourceCd) : null;
    }

    private BooleanExpression activityIdEq(Long activityId) {
        return activityId != null ? activity.activityId.eq(activityId) : null;
    }

}
