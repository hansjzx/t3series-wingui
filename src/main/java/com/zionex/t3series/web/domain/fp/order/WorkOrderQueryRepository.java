package com.zionex.t3series.web.domain.fp.order;

import static com.zionex.t3series.web.domain.fp.bom.QBomRouting.bomRouting;
import static com.zionex.t3series.web.domain.fp.item.QInventory.inventory;
import static com.zionex.t3series.web.domain.fp.item.QItem.item;
import static com.zionex.t3series.web.domain.fp.order.QWorkOrder.workOrder;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class WorkOrderQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public List<WorkOrder> getWorkOrdersByRouteCd(String routeCd) {
        return jpaQueryFactory
                .select(Projections.fields(WorkOrder.class,
                        workOrder.id,
                        workOrder.salesOrder.soCd.as("soCode"),
                        workOrder.woCd,
                        workOrder.inventory.inventoryCd.as("inventoryCode"),
                        workOrder.inventory.inventoryNm.as("inventoryName"),
                        workOrder.inventory.item.itemCd.as("itemCode"),
                        workOrder.inventory.item.itemNm.as("itemName"),
                        workOrder.requestQty,
                        workOrder.dueDt
                ))
                .from(workOrder)
                .leftJoin(bomRouting).on((bomRouting.bomTpCd.eq("P")
                        .and(bomRouting.inventory.inventoryCd.eq(workOrder.inventory.inventoryCd))))
                .leftJoin(workOrder.inventory, inventory)
                .leftJoin(workOrder.inventory.item, item)
                .where(routeCdEq(routeCd))
                .orderBy(workOrder.woCd.asc())
                .fetch();
    }

    private BooleanExpression routeCdEq(String routeCd) {
        return StringUtils.hasText(routeCd) ? bomRouting.route.routeCd.eq(routeCd) : null;
    }

}
