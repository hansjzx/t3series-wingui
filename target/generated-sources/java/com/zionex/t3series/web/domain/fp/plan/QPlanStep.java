package com.zionex.t3series.web.domain.fp.plan;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QPlanStep is a Querydsl query type for PlanStep
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QPlanStep extends EntityPathBase<PlanStep> {

    private static final long serialVersionUID = 1310000622L;

    public static final QPlanStep planStep = new QPlanStep("planStep");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath id = createString("id");

    public final StringPath stepCd = createString("stepCd");

    public final StringPath stepNm = createString("stepNm");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QPlanStep(String variable) {
        super(PlanStep.class, forVariable(variable));
    }

    public QPlanStep(Path<? extends PlanStep> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPlanStep(PathMetadata metadata) {
        super(PlanStep.class, metadata);
    }

}

