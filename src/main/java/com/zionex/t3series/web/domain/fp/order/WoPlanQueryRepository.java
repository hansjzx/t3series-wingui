package com.zionex.t3series.web.domain.fp.order;

import static com.zionex.t3series.web.domain.fp.customer.QCustomer.customer;
import static com.zionex.t3series.web.domain.fp.order.QSalesOrder.salesOrder;
import static com.zionex.t3series.web.domain.fp.order.QWoPlan.woPlan;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zionex.t3series.web.domain.fp.gantt.resource.ActivityDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class WoPlanQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public ActivityDetail getWoTooltip(String versionCd, String plantCd, String woCd) {
        return jpaQueryFactory
                .select(Projections.fields(ActivityDetail.class,
                        woPlan.woCd,
                        woPlan.inventoryCd.concat(" (").concat(woPlan.inventoryNm.coalesce("")).concat(")").as("inventoryCd"),
                        woPlan.shptQty.stringValue().concat(" (").concat(woPlan.itemUom.coalesce("")).concat(")").as("shptQty"),
                        woPlan.dueDt,
                        woPlan.startTs.as("woStartTs"),
                        woPlan.endTs.as("woEndTs"),
                        woPlan.lateYn,
                        woPlan.planSeq,
                        woPlan.soCd,
                        salesOrder.requestQty.stringValue().coalesce("").asString().concat(" (").concat(woPlan.itemUom.coalesce("")).concat(")").as("requestQty"),
                        salesOrder.customer.customerCd.coalesce("").asString().concat(" (").concat(customer.customerNm.coalesce("")).concat(")").as("customerCd")
                ))
                .from(woPlan)
                .leftJoin(salesOrder).on(salesOrder.soCd.eq(woPlan.soCd))
                .leftJoin(customer).on(customer.customerCd.eq(salesOrder.customer.customerCd))
                .where(woPlan.versionCd.eq(versionCd), woPlan.plantCd.eq(plantCd), woPlan.woCd.eq(woCd))
                .fetchOne();
    }

}
