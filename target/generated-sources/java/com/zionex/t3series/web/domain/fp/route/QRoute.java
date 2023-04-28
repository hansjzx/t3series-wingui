package com.zionex.t3series.web.domain.fp.route;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRoute is a Querydsl query type for Route
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QRoute extends EntityPathBase<Route> {

    private static final long serialVersionUID = 935849560L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRoute route = new QRoute("route");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final BooleanPath batchRouteYn = createBoolean("batchRouteYn");

    public final NumberPath<Long> candidatePeriodCnt = createNumber("candidatePeriodCnt", Long.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descTxt = createString("descTxt");

    public final StringPath divideTpCd = createString("divideTpCd");

    public final StringPath id = createString("id");

    public final BooleanPath lazyJcTmYn = createBoolean("lazyJcTmYn");

    public final NumberPath<Double> lotSizeMax = createNumber("lotSizeMax", Double.class);

    public final NumberPath<Double> lotSizeMin = createNumber("lotSizeMin", Double.class);

    public final NumberPath<Double> lotSizeMultiplr = createNumber("lotSizeMultiplr", Double.class);

    public final StringPath routeCd = createString("routeCd");

    public final QRouteGrp routeGrp;

    public final StringPath routeNm = createString("routeNm");

    public final com.zionex.t3series.web.domain.fp.organization.QStage stage;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QRoute(String variable) {
        this(Route.class, forVariable(variable), INITS);
    }

    public QRoute(Path<? extends Route> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRoute(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRoute(PathMetadata metadata, PathInits inits) {
        this(Route.class, metadata, inits);
    }

    public QRoute(Class<? extends Route> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.routeGrp = inits.isInitialized("routeGrp") ? new QRouteGrp(forProperty("routeGrp")) : null;
        this.stage = inits.isInitialized("stage") ? new com.zionex.t3series.web.domain.fp.organization.QStage(forProperty("stage"), inits.get("stage")) : null;
    }

}

