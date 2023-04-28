package com.zionex.t3series.web.domain.fp.stock;

import static com.zionex.t3series.web.domain.fp.item.QInventory.inventory;
import static com.zionex.t3series.web.domain.fp.item.QItem.item;
import static com.zionex.t3series.web.domain.fp.order.QSalesOrder.salesOrder;
import static com.zionex.t3series.web.domain.fp.order.QWorkOrder.workOrder;
import static com.zionex.t3series.web.domain.fp.stock.QSoStockAssign.soStockAssign;
import static com.zionex.t3series.web.domain.fp.stock.QWoStockAssign.woStockAssign;
import static com.zionex.t3series.web.domain.fp.stock.QStock.stock;
import static com.zionex.t3series.web.domain.fp.stock.QStockInputPlan.stockInputPlan;
import static com.zionex.t3series.web.domain.fp.stock.QStockOutputPlan.stockOutputPlan;
import static com.zionex.t3series.web.domain.fp.activity.QActivity.activity;

import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zionex.t3series.web.domain.fp.analysis.StockOutputResult;
import com.zionex.t3series.web.domain.fp.result.OrderTrackingResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class StockOutputPlanQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public List<OrderTrackingResult> getStocksTree(String versionCd, List<String> plantCds) {
        return jpaQueryFactory
                .select(Projections.fields(OrderTrackingResult.class,
                        stockOutputPlan.activityId.stringValue().trim().as("parent"),
                        stockOutputPlan.stockCd.as("tree"),
                        stockOutputPlan.woCd,
                        stockOutputPlan.stockCd.as("routeCd"),
                        stockOutputPlan.inventoryCd.as("itemCd"),
                        inventory.inventoryNm.as("itemNm"),
                        item.itemUom.as("uom"),
                        stockOutputPlan.usedQty.as("qty"),
                        stockOutputPlan.usedTs.as("startTs")
                ))
                .from(stockOutputPlan)
                .innerJoin(activity).on(stockOutputPlan.versionCd.eq(activity.versionCd)
                        .and(stockOutputPlan.plantCd.eq(activity.plantCd))
                        .and(stockOutputPlan.activityId.eq(activity.activityId)))
                .leftJoin(inventory).on(stockOutputPlan.inventoryCd.eq(inventory.inventoryCd))
                .leftJoin(item).on(inventory.item.itemCd.eq(item.itemCd))
                .where(activity.versionCd.eq(versionCd), activity.plantCd.in(plantCds))
                .fetch();
    }

    public List<StockOutputResult> getStockOutputs(String versionCd, List<String> plantCds) {
        return jpaQueryFactory
                .select(Projections.fields(StockOutputResult.class,
                        stockOutputPlan.stockCd,
                        stock.descTxt,
                        stockOutputPlan.inventoryCd,
                        inventory.inventoryNm,
                        item.itemCd,
                        item.itemNm,
                        item.itemClassCd,
                        stock.usableTs.coalesce(stock.receiptTs).asDate().coalesce(stockInputPlan.availTs).as("usableTs"),
                        stock.qty.coalesce(stockInputPlan.availQty).as("usableQty"),
                        stock.expireTs,
                        stockInputPlan.woCd.as("createdBy"),
                        stockOutputPlan.usedTs,
                        stockOutputPlan.usedQty,
                        stockOutputPlan.woCd,
                        salesOrder.soCd,
                        ExpressionUtils.as(new CaseBuilder()
                                .when(soStockAssign.assignYn.coalesce(woStockAssign.assignYn).asBoolean().isNull())
                                .then("N").otherwise("Y"), "isPegging")
                ))
                .from(stockOutputPlan)
                .leftJoin(stock).on(stockOutputPlan.stockCd.eq(stock.stockCd))
                .leftJoin(inventory).on(stockOutputPlan.inventoryCd.eq(inventory.inventoryCd))
                .leftJoin(item).on(inventory.item.itemCd.eq(item.itemCd))
                .leftJoin(workOrder).on(stockOutputPlan.woCd.eq(workOrder.woCd))
                .leftJoin(salesOrder).on(workOrder.salesOrder.soCd.eq(salesOrder.soCd))
                .leftJoin(stockInputPlan).on(stockOutputPlan.stockCd.eq(stockInputPlan.stockCd).and(stockOutputPlan.versionCd.eq(stockInputPlan.versionCd)))
                .leftJoin(soStockAssign).on(stockOutputPlan.stockCd.eq(soStockAssign.stockCd).and(salesOrder.soCd.eq(soStockAssign.soCd)).and(soStockAssign.assignYn.isTrue()))
                .leftJoin(woStockAssign).on(stockOutputPlan.stockCd.eq(woStockAssign.stockCd).and(stockOutputPlan.woCd.eq(woStockAssign.woCd)).and(woStockAssign.assignYn.isTrue()))
                .where(stockOutputPlan.versionCd.eq(versionCd), stockOutputPlan.plantCd.in(plantCds))
                .orderBy(stockOutputPlan.stockCd.asc())
                .fetch();
    }

}
