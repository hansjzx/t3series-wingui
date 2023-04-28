package com.zionex.t3series.web.domain.fp.activity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QActivity is a Querydsl query type for Activity
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QActivity extends EntityPathBase<Activity> {

    private static final long serialVersionUID = -1015996350L;

    public static final QActivity activity = new QActivity("activity");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final NumberPath<Long> activityId = createNumber("activityId", Long.class);

    public final BooleanPath cfmYn = createBoolean("cfmYn");

    public final DateTimePath<java.time.LocalDateTime> completedTs = createDateTime("completedTs", java.time.LocalDateTime.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath displayColor = createString("displayColor");

    public final StringPath divideTpCd = createString("divideTpCd");

    public final DateTimePath<java.time.LocalDateTime> endTs = createDateTime("endTs", java.time.LocalDateTime.class);

    public final StringPath id = createString("id");

    public final StringPath itemCd = createString("itemCd");

    public final StringPath itemNm = createString("itemNm");

    public final StringPath itemUom = createString("itemUom");

    public final NumberPath<Double> moveTm = createNumber("moveTm", Double.class);

    public final StringPath nextJcDivideTpCd = createString("nextJcDivideTpCd");

    public final DateTimePath<java.time.LocalDateTime> nextJcEndTs = createDateTime("nextJcEndTs", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> nextJcStartTs = createDateTime("nextJcStartTs", java.time.LocalDateTime.class);

    public final NumberPath<Double> nextJcTm = createNumber("nextJcTm", Double.class);

    public final StringPath plantCd = createString("plantCd");

    public final StringPath prevJcDivideTpCd = createString("prevJcDivideTpCd");

    public final DateTimePath<java.time.LocalDateTime> prevJcEndTs = createDateTime("prevJcEndTs", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> prevJcStartTs = createDateTime("prevJcStartTs", java.time.LocalDateTime.class);

    public final NumberPath<Double> prevJcTm = createNumber("prevJcTm", Double.class);

    public final NumberPath<Double> processTm = createNumber("processTm", Double.class);

    public final NumberPath<Double> qty = createNumber("qty", Double.class);

    public final NumberPath<Double> queueTm = createNumber("queueTm", Double.class);

    public final StringPath resourceCd = createString("resourceCd");

    public final StringPath resourceTpCd = createString("resourceTpCd");

    public final StringPath routeCd = createString("routeCd");

    public final StringPath routeNm = createString("routeNm");

    public final NumberPath<Double> setupTm = createNumber("setupTm", Double.class);

    public final StringPath stageCd = createString("stageCd");

    public final DateTimePath<java.time.LocalDateTime> startTs = createDateTime("startTs", java.time.LocalDateTime.class);

    public final StringPath timeUom = createString("timeUom");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final StringPath versionCd = createString("versionCd");

    public final NumberPath<Long> virtualResourceSeq = createNumber("virtualResourceSeq", Long.class);

    public final NumberPath<Double> waitTm = createNumber("waitTm", Double.class);

    public final BooleanPath wipYn = createBoolean("wipYn");

    public final StringPath woCd = createString("woCd");

    public QActivity(String variable) {
        super(Activity.class, forVariable(variable));
    }

    public QActivity(Path<? extends Activity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QActivity(PathMetadata metadata) {
        super(Activity.class, metadata);
    }

}

