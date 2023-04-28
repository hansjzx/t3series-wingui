package com.zionex.t3series.web.domain.fp.Jobchange;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QJcTimeGrp is a Querydsl query type for JcTimeGrp
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QJcTimeGrp extends EntityPathBase<JcTimeGrp> {

    private static final long serialVersionUID = 1719822386L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QJcTimeGrp jcTimeGrp = new QJcTimeGrp("jcTimeGrp");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath id = createString("id");

    public final StringPath jcDivideTpCd = createString("jcDivideTpCd");

    public final NumberPath<Long> nextJcTm = createNumber("nextJcTm", Long.class);

    public final com.zionex.t3series.web.domain.fp.route.QRouteGrp nextRouteGrp;

    public final NumberPath<Long> prevJcTm = createNumber("prevJcTm", Long.class);

    public final com.zionex.t3series.web.domain.fp.route.QRouteGrp prevRouteGrp;

    public final com.zionex.t3series.web.domain.fp.resource.QResource resource;

    public final StringPath timeUom = createString("timeUom");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QJcTimeGrp(String variable) {
        this(JcTimeGrp.class, forVariable(variable), INITS);
    }

    public QJcTimeGrp(Path<? extends JcTimeGrp> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QJcTimeGrp(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QJcTimeGrp(PathMetadata metadata, PathInits inits) {
        this(JcTimeGrp.class, metadata, inits);
    }

    public QJcTimeGrp(Class<? extends JcTimeGrp> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.nextRouteGrp = inits.isInitialized("nextRouteGrp") ? new com.zionex.t3series.web.domain.fp.route.QRouteGrp(forProperty("nextRouteGrp")) : null;
        this.prevRouteGrp = inits.isInitialized("prevRouteGrp") ? new com.zionex.t3series.web.domain.fp.route.QRouteGrp(forProperty("prevRouteGrp")) : null;
        this.resource = inits.isInitialized("resource") ? new com.zionex.t3series.web.domain.fp.resource.QResource(forProperty("resource"), inits.get("resource")) : null;
    }

}

