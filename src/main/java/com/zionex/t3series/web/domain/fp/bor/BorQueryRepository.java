package com.zionex.t3series.web.domain.fp.bor;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.zionex.t3series.web.domain.fp.master.BorMaster;
import com.zionex.t3series.web.domain.fp.master.BorSetMaster;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

import static com.zionex.t3series.web.domain.fp.bom.QBomRouting.bomRouting;
import static com.zionex.t3series.web.domain.fp.bor.QBorSetDtl.borSetDtl;
import static com.zionex.t3series.web.domain.fp.bor.QBor.bor;
import static com.zionex.t3series.web.domain.fp.resource.QResource.resource;
import static com.zionex.t3series.web.domain.fp.route.QRoute.route;

@Repository
@RequiredArgsConstructor
public class BorQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public List<BorSetMaster> getBorSetMasters(String searchItem, String searchRoute, String searchResource) {
        return jpaQueryFactory
                .select(Projections.fields(BorSetMaster.class,
                        borSetDtl.id,
                        bomRouting.inventory.item.itemCd.as("itemCode"),
                        bomRouting.inventory.item.itemNm.as("itemName"),
                        bomRouting.inventory.item.itemClassCd.as("itemClassCode"),
                        bomRouting.inventory.inventoryCd.as("inventoryCode"),
                        bomRouting.inventory.inventoryNm.as("inventoryName"),
                        bomRouting.route.routeCd.as("routeCode"),
                        bomRouting.route.routeNm.as("routeName"),
                        borSetDtl.borSetMst.borSetCd.as("borSetCode"),
                        borSetDtl.borSetMst.descTxt.as("mstDescTxt"),
                        borSetDtl.resource.resourceCd.as("resourceCode"),
                        borSetDtl.resource.resourceNm.as("resourceName"),
                        borSetDtl.resourceTpCd
                    ))
                .from(bomRouting)
                .innerJoin(borSetDtl).on(bomRouting.route.routeCd.eq(borSetDtl.route.routeCd))
                .where(bomRouting.bomTpCd.eq("P"))
                .where(bomRouting.inventory.item.itemCd.like("%" + searchItem + "%").or(bomRouting.inventory.item.itemNm.like("%" + searchItem + "%")))
                .where(bomRouting.route.routeCd.like("%" + searchRoute + "%").or(bomRouting.route.routeNm.like("%" + searchRoute + "%")))
                .where(borSetDtl.resource.resourceCd.like("%" + searchResource + "%").or(borSetDtl.resource.resourceNm.like("%" + searchResource + "%")))
                .fetch();
    }

    public List<BorMaster> getBorMasters(String searchItem, String searchRoute, String searchResource) {
        return jpaQueryFactory
                .select(Projections.fields(BorMaster.class,
                        bor.id,
                        bomRouting.inventory.item.itemCd.as("itemCode"),
                        bomRouting.inventory.item.itemNm.as("itemName"),
                        bomRouting.inventory.item.itemClassCd.as("itemClassCode"),
                        bomRouting.inventory.inventoryCd.as("inventoryCode"),
                        bomRouting.inventory.inventoryNm.as("inventoryName"),
                        bomRouting.route.routeCd.as("routeCode"),
                        bomRouting.route.routeNm.as("routeName"),
                        bor.resource.resourceCd.as("resourceCode"),
                        bor.resource.resourceNm.as("resourceName"),
                        bor.descTxt,
                        bor.altResourcePriority,
                        bor.timeUom,
                        bor.queueTm,
                        bor.setupTm,
                        bor.processTm,
                        bor.waitTm,
                        bor.moveTm,
                        bor.lotSizeMin,
                        bor.lotSizeMax,
                        bor.lotSizeMultiplr,
                        bor.efficiency,
                        bor.processTmTpCd,
                        bor.stdProcessTm,
                        bor.transferBatchTm,
                        bor.divideTpCd,
                        bor.createdBy,
                        bor.createdAt,
                        bor.updatedBy,
                        bor.updatedAt
                    ))
                .from(bomRouting)
                .innerJoin(bor).on(bomRouting.route.routeCd.eq(bor.route.routeCd))
                .where(bomRouting.bomTpCd.eq("P"))
                .where(bomRouting.inventory.item.itemCd.like("%" + searchItem + "%").or(bomRouting.inventory.item.itemNm.like("%" + searchItem + "%")))
                .where(bomRouting.route.routeCd.like("%" + searchRoute + "%").or(bomRouting.route.routeNm.like("%" + searchRoute + "%")))
                .where(bor.resource.resourceCd.like("%" + searchResource + "%").or(bor.resource.resourceNm.like("%" + searchResource + "%")))
                .orderBy(bomRouting.inventory.item.itemCd.asc())
                .orderBy(bomRouting.inventory.inventoryCd.asc())
                .orderBy(bomRouting.route.routeCd.asc())
                .orderBy(bor.resource.resourceCd.asc())
                .fetch();
    }

    public List<Bor> getBorsByInventoryCd(String inventoryCd) {
        return jpaQueryFactory
                .select(Projections.fields(Bor.class,
                        bor.id,
                        bor.route.routeCd.as("routeCode"),
                        bor.route.routeNm.as("routeName"),
                        borSetDtl.borSetMst.borSetCd,
                        bor.resource.resourceCd.as("resourceCode"),
                        bor.resource.resourceNm.as("resourceName")
                ))
                .from(bor)
                .leftJoin(borSetDtl).on(bor.route.routeCd.eq(borSetDtl.route.routeCd)
                        .and(bor.resource.resourceCd.eq(borSetDtl.resource.resourceCd)))
                .leftJoin(bomRouting).on((bomRouting.bomTpCd.eq("P"))
                        .and(bor.route.routeCd.eq(bomRouting.route.routeCd)))
                .leftJoin(bor.resource, resource)
                .leftJoin(bor.route, route)
                .where(inventoryCdEq(inventoryCd))
                .orderBy(bor.route.routeCd.asc(), borSetDtl.borSetMst.borSetCd.asc(), bor.resource.resourceCd.asc())
                .fetch();
    }

    private BooleanExpression inventoryCdEq(String inventoryCd) {
        return StringUtils.isBlank(inventoryCd) ? null : bomRouting.inventory.inventoryCd.eq(inventoryCd);
    }

}
