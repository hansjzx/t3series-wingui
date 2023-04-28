package com.zionex.t3series.web.domain.fp.plan;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QPlanPolicyDetail is a Querydsl query type for PlanPolicyDetail
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QPlanPolicyDetail extends EntityPathBase<PlanPolicyDetail> {

    private static final long serialVersionUID = -567592635L;

    public static final QPlanPolicyDetail planPolicyDetail = new QPlanPolicyDetail("planPolicyDetail");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final StringPath categoryCd = createString("categoryCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath id = createString("id");

    public final StringPath itemSeq = createString("itemSeq");

    public final StringPath itemVal = createString("itemVal");

    public final StringPath policyCd = createString("policyCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QPlanPolicyDetail(String variable) {
        super(PlanPolicyDetail.class, forVariable(variable));
    }

    public QPlanPolicyDetail(Path<? extends PlanPolicyDetail> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPlanPolicyDetail(PathMetadata metadata) {
        super(PlanPolicyDetail.class, metadata);
    }

}

