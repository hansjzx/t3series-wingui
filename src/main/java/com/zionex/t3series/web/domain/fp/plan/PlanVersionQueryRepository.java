package com.zionex.t3series.web.domain.fp.plan;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.zionex.t3series.web.domain.fp.plan.QMainVersion.mainVersion;
import static com.zionex.t3series.web.domain.fp.plan.QPlanVersion.planVersion;

@Repository
@RequiredArgsConstructor
public class PlanVersionQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;
    
    public List<PlanVersion> getPlanVersionsByMainVersionCds(List<String> mainVersionCds) {
        return jpaQueryFactory
                .select(Projections.fields(PlanVersion.class,
                        planVersion.versionCd,
                        planVersion.versionSeq,
                        planVersion.descripText,
                        planVersion.planDt,
                        planVersion.startTs,
                        planVersion.freezeTs,
                        planVersion.endTs,
                        planVersion.policyCd,
                        planVersion.stepSeq,
                        planVersion.mainVersionCd,
                        planVersion.stepCd,
                        planVersion.confirmYn,
                        planVersion.confirmedBy,
                        planVersion.confirmedAt
                        ))
                .from(planVersion)
                .where(planVersion.mainVersionCd.in(mainVersionCds))
                .leftJoin(mainVersion).on(planVersion.mainVersionCd.eq(mainVersion.mainVersionCd))
                .orderBy(mainVersion.versionSeq.desc(), planVersion.versionSeq.desc())
                .fetch();
    }
    
}
