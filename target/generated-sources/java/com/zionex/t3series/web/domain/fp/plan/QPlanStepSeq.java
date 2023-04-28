package com.zionex.t3series.web.domain.fp.plan;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QPlanStepSeq is a Querydsl query type for PlanStepSeq
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QPlanStepSeq extends EntityPathBase<PlanStepSeq> {

    private static final long serialVersionUID = -2139205743L;

    public static final QPlanStepSeq planStepSeq = new QPlanStepSeq("planStepSeq");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descTxt = createString("descTxt");

    public final StringPath execTarget = createString("execTarget");

    public final StringPath execTpCd = createString("execTpCd");

    public final StringPath id = createString("id");

    public final StringPath stepCd = createString("stepCd");

    public final NumberPath<Long> stepSeq = createNumber("stepSeq", Long.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QPlanStepSeq(String variable) {
        super(PlanStepSeq.class, forVariable(variable));
    }

    public QPlanStepSeq(Path<? extends PlanStepSeq> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPlanStepSeq(PathMetadata metadata) {
        super(PlanStepSeq.class, metadata);
    }

}

