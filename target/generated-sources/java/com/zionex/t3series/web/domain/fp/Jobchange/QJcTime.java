package com.zionex.t3series.web.domain.fp.Jobchange;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QJcTime is a Querydsl query type for JcTime
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QJcTime extends EntityPathBase<JcTime> {

    private static final long serialVersionUID = 608022451L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QJcTime jcTime = new QJcTime("jcTime");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath id = createString("id");

    public final StringPath jcDivideTpCd = createString("jcDivideTpCd");

    public final NumberPath<Double> nextJcTm = createNumber("nextJcTm", Double.class);

    public final com.zionex.t3series.web.domain.fp.route.QRoute nextRoute;

    public final NumberPath<Double> prevJcTm = createNumber("prevJcTm", Double.class);

    public final com.zionex.t3series.web.domain.fp.route.QRoute prevRoute;

    public final com.zionex.t3series.web.domain.fp.resource.QResource resource;

    public final StringPath timeUom = createString("timeUom");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QJcTime(String variable) {
        this(JcTime.class, forVariable(variable), INITS);
    }

    public QJcTime(Path<? extends JcTime> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QJcTime(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QJcTime(PathMetadata metadata, PathInits inits) {
        this(JcTime.class, metadata, inits);
    }

    public QJcTime(Class<? extends JcTime> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.nextRoute = inits.isInitialized("nextRoute") ? new com.zionex.t3series.web.domain.fp.route.QRoute(forProperty("nextRoute"), inits.get("nextRoute")) : null;
        this.prevRoute = inits.isInitialized("prevRoute") ? new com.zionex.t3series.web.domain.fp.route.QRoute(forProperty("prevRoute"), inits.get("prevRoute")) : null;
        this.resource = inits.isInitialized("resource") ? new com.zionex.t3series.web.domain.fp.resource.QResource(forProperty("resource"), inits.get("resource")) : null;
    }

}

