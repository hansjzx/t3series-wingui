package com.zionex.t3series.web.domain.fp.plan;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QPlanStatus is a Querydsl query type for PlanStatus
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QPlanStatus extends EntityPathBase<PlanStatus> {

    private static final long serialVersionUID = 485068436L;

    public static final QPlanStatus planStatus = new QPlanStatus("planStatus");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final DateTimePath<java.time.LocalDateTime> endTs = createDateTime("endTs", java.time.LocalDateTime.class);

    public final StringPath id = createString("id");

    public final DateTimePath<java.time.LocalDateTime> startTs = createDateTime("startTs", java.time.LocalDateTime.class);

    public final StringPath statusLog = createString("statusLog");

    public final StringPath statusTypeCd = createString("statusTypeCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final StringPath versionCd = createString("versionCd");

    public QPlanStatus(String variable) {
        super(PlanStatus.class, forVariable(variable));
    }

    public QPlanStatus(Path<? extends PlanStatus> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPlanStatus(PathMetadata metadata) {
        super(PlanStatus.class, metadata);
    }

}

