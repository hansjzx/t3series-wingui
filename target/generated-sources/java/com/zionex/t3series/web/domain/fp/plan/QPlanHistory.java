package com.zionex.t3series.web.domain.fp.plan;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QPlanHistory is a Querydsl query type for PlanHistory
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QPlanHistory extends EntityPathBase<PlanHistory> {

    private static final long serialVersionUID = 681310770L;

    public static final QPlanHistory planHistory = new QPlanHistory("planHistory");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descTxt = createString("descTxt");

    public final DateTimePath<java.time.LocalDateTime> endTs = createDateTime("endTs", java.time.LocalDateTime.class);

    public final StringPath id = createString("id");

    public final StringPath mainVersionCd = createString("mainVersionCd");

    public final DateTimePath<java.time.LocalDateTime> startTs = createDateTime("startTs", java.time.LocalDateTime.class);

    public final StringPath statusLog = createString("statusLog");

    public final StringPath statusTpCd = createString("statusTpCd");

    public final StringPath stepCd = createString("stepCd");

    public final NumberPath<Long> stepSeq = createNumber("stepSeq", Long.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final StringPath versionCd = createString("versionCd");

    public QPlanHistory(String variable) {
        super(PlanHistory.class, forVariable(variable));
    }

    public QPlanHistory(Path<? extends PlanHistory> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPlanHistory(PathMetadata metadata) {
        super(PlanHistory.class, metadata);
    }

}

