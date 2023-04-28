package com.zionex.t3series.web.domain.fp.wip;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QWip is a Querydsl query type for Wip
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QWip extends EntityPathBase<Wip> {

    private static final long serialVersionUID = 814693314L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QWip wip = new QWip("wip");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final StringPath attrGrpCd = createString("attrGrpCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final DateTimePath<java.time.LocalDateTime> endTs = createDateTime("endTs", java.time.LocalDateTime.class);

    public final StringPath grade = createString("grade");

    public final StringPath id = createString("id");

    public final StringPath projectionInventoryCd = createString("projectionInventoryCd");

    public final StringPath projectionWoCd = createString("projectionWoCd");

    public final DateTimePath<java.time.LocalDateTime> projectionWoDueDt = createDateTime("projectionWoDueDt", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> releaseTs = createDateTime("releaseTs", java.time.LocalDateTime.class);

    public final NumberPath<Double> remainQty = createNumber("remainQty", Double.class);

    public final com.zionex.t3series.web.domain.fp.route.QRoute route;

    public final DateTimePath<java.time.LocalDateTime> startTs = createDateTime("startTs", java.time.LocalDateTime.class);

    public final BooleanPath toStockYn = createBoolean("toStockYn");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final NumberPath<Long> wipId = createNumber("wipId", Long.class);

    public final NumberPath<Double> wipQty = createNumber("wipQty", Double.class);

    public final StringPath woCd = createString("woCd");

    public QWip(String variable) {
        this(Wip.class, forVariable(variable), INITS);
    }

    public QWip(Path<? extends Wip> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QWip(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QWip(PathMetadata metadata, PathInits inits) {
        this(Wip.class, metadata, inits);
    }

    public QWip(Class<? extends Wip> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.route = inits.isInitialized("route") ? new com.zionex.t3series.web.domain.fp.route.QRoute(forProperty("route"), inits.get("route")) : null;
    }

}

