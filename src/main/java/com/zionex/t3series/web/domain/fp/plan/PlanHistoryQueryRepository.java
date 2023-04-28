package com.zionex.t3series.web.domain.fp.plan;

import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zionex.t3series.web.domain.fp.simulation.SimulationHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.querydsl.core.types.ExpressionUtils.count;
import static com.zionex.t3series.web.domain.fp.plan.QPlanHistory.planHistory;
import static com.zionex.t3series.web.domain.fp.plan.QPlanPolicy.planPolicy;
import static com.zionex.t3series.web.domain.fp.plan.QPlanVersion.planVersion;
import static com.zionex.t3series.web.domain.fp.plan.QSimulOption.simulOption;

@Repository
@RequiredArgsConstructor
public class PlanHistoryQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public List<SimulationHistory> getSimulationHistories() {
        return jpaQueryFactory
                .select(Projections.fields(SimulationHistory.class,
                        planHistory.mainVersionCd,
                        planHistory.versionCd.as("planVersionCd"),
                        planHistory.descTxt,
                        planPolicy.policyNm.as("policyCd"),
                        planVersion.confirmYn,
                        planHistory.startTs,
                        planHistory.endTs,
                        planHistory.statusLog,
                        planHistory.updatedBy.as("user"),
                        ExpressionUtils.as(new CaseBuilder()
                                .when(JPAExpressions.select(count(simulOption.id))
                                        .from(simulOption)
                                        .where(simulOption.versionCd.eq(planHistory.versionCd)).goe(1L))
                                .then("Y").otherwise("N"), "hasOptions")
                ))
                .from(planHistory)
                .leftJoin(planVersion).on(planVersion.versionCd.eq(planHistory.versionCd))
                .leftJoin(planPolicy).on(planPolicy.policyCd.eq(planVersion.policyCd))
                .orderBy(planHistory.mainVersionCd.desc(), planVersion.versionSeq.desc())
                .fetch();
    }
    
}
