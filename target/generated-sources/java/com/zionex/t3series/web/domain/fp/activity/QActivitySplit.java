package com.zionex.t3series.web.domain.fp.activity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QActivitySplit is a Querydsl query type for ActivitySplit
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QActivitySplit extends EntityPathBase<ActivitySplit> {

    private static final long serialVersionUID = -878124040L;

    public static final QActivitySplit activitySplit = new QActivitySplit("activitySplit");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final NumberPath<Long> activityId = createNumber("activityId", Long.class);

    public final BooleanPath confirmYn = createBoolean("confirmYn");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final DateTimePath<java.time.LocalDateTime> endTs = createDateTime("endTs", java.time.LocalDateTime.class);

    public final StringPath id = createString("id");

    public final StringPath itemCd = createString("itemCd");

    public final StringPath plantCd = createString("plantCd");

    public final NumberPath<Double> qty = createNumber("qty", Double.class);

    public final StringPath resourceCd = createString("resourceCd");

    public final StringPath routeCd = createString("routeCd");

    public final NumberPath<Long> splitSeq = createNumber("splitSeq", Long.class);

    public final StringPath stageCd = createString("stageCd");

    public final DateTimePath<java.time.LocalDateTime> startTs = createDateTime("startTs", java.time.LocalDateTime.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final StringPath versionCd = createString("versionCd");

    public final BooleanPath wipYn = createBoolean("wipYn");

    public final StringPath woCd = createString("woCd");

    public QActivitySplit(String variable) {
        super(ActivitySplit.class, forVariable(variable));
    }

    public QActivitySplit(Path<? extends ActivitySplit> path) {
        super(path.getType(), path.getMetadata());
    }

    public QActivitySplit(PathMetadata metadata) {
        super(ActivitySplit.class, metadata);
    }

}

