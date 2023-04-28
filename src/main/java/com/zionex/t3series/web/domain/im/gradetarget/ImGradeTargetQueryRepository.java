package com.zionex.t3series.web.domain.im.gradetarget;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import static com.zionex.t3series.web.domain.im.gradetarget.QItemMst.itemMst;
import static com.zionex.t3series.web.domain.im.gradetarget.QItemType.itemType;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ImGradeTargetQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public Page<ItemMst> getGradeTargetData(String itemCd, String itemNm, String itemTp, Pageable pageable) {
        List<ItemMst> content = jpaQueryFactory
                .select(Projections.fields(ItemMst.class,
                        itemMst.id,
                        itemMst.itemCd,
                        itemMst.itemNm,
                        itemMst.itemTpId,
                        itemMst.dpPlanYn,
                        itemMst.gradeYn,
                        itemMst.gradeModifyBy.as("MODIFY_BY"),
                        itemMst.gradeModifyDttm.as("MODIFY_DTTM")
                    ))
                .from(itemMst)
                .innerJoin(itemType).on(itemType.id.eq(itemMst.itemTpId))
                .where(itemType.convnNm.eq("FG"))
                .where(itemMst.itemCd.toUpperCase().like("%" + itemCd.toUpperCase() + "%"))
                .where(itemMst.itemNm.toUpperCase().like("%" + itemNm.toUpperCase() + "%"))
                .where(itemType.convnNm.toUpperCase().like("%" + itemTp.toUpperCase() + "%"))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(itemMst.itemCd.asc())
                .fetch();

        JPAQuery<Long> countQuery = jpaQueryFactory
                .select(itemMst.count())
                .from(itemMst)
                .innerJoin(itemType).on(itemType.id.eq(itemMst.itemTpId))
                .where(itemType.convnNm.eq("FG"))
                .where(itemMst.itemCd.toUpperCase().like("%" + itemCd.toUpperCase() + "%"))
                .where(itemMst.itemNm.toUpperCase().like("%" + itemNm.toUpperCase() + "%"))
                .where(itemType.convnNm.toUpperCase().like("%" + itemTp.toUpperCase() + "%"));

        if (content.size() != 0) {
            return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
        }

        return null;
    }
}
