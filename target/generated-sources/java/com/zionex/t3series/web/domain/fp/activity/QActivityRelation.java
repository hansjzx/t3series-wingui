package com.zionex.t3series.web.domain.fp.activity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QActivityRelation is a Querydsl query type for ActivityRelation
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QActivityRelation extends EntityPathBase<ActivityRelation> {

    private static final long serialVersionUID = 1824791646L;

    public static final QActivityRelation activityRelation = new QActivityRelation("activityRelation");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath id = createString("id");

    public final NumberPath<Long> nextActivityId = createNumber("nextActivityId", Long.class);

    public final NumberPath<Long> prevActivityId = createNumber("prevActivityId", Long.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final NumberPath<Double> usedQty = createNumber("usedQty", Double.class);

    public final StringPath versionCd = createString("versionCd");

    public QActivityRelation(String variable) {
        super(ActivityRelation.class, forVariable(variable));
    }

    public QActivityRelation(Path<? extends ActivityRelation> path) {
        super(path.getType(), path.getMetadata());
    }

    public QActivityRelation(PathMetadata metadata) {
        super(ActivityRelation.class, metadata);
    }

}

