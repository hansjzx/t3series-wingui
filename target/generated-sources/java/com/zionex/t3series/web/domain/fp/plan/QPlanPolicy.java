package com.zionex.t3series.web.domain.fp.plan;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QPlanPolicy is a Querydsl query type for PlanPolicy
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QPlanPolicy extends EntityPathBase<PlanPolicy> {

    private static final long serialVersionUID = 394879956L;

    public static final QPlanPolicy planPolicy = new QPlanPolicy("planPolicy");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final BooleanPath defaultYn = createBoolean("defaultYn");

    public final StringPath id = createString("id");

    public final StringPath policyCd = createString("policyCd");

    public final StringPath policyNm = createString("policyNm");

    public final BooleanPath requiredYn = createBoolean("requiredYn");

    public final StringPath scriptNm = createString("scriptNm");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QPlanPolicy(String variable) {
        super(PlanPolicy.class, forVariable(variable));
    }

    public QPlanPolicy(Path<? extends PlanPolicy> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPlanPolicy(PathMetadata metadata) {
        super(PlanPolicy.class, metadata);
    }

}

