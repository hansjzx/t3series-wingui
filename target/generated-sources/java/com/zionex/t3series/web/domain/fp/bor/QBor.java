package com.zionex.t3series.web.domain.fp.bor;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBor is a Querydsl query type for Bor
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QBor extends EntityPathBase<Bor> {

    private static final long serialVersionUID = -469412848L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBor bor = new QBor("bor");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final NumberPath<Long> altResourcePriority = createNumber("altResourcePriority", Long.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descTxt = createString("descTxt");

    public final StringPath divideTpCd = createString("divideTpCd");

    public final NumberPath<Double> efficiency = createNumber("efficiency", Double.class);

    public final StringPath id = createString("id");

    public final NumberPath<Double> lotSizeMax = createNumber("lotSizeMax", Double.class);

    public final NumberPath<Double> lotSizeMin = createNumber("lotSizeMin", Double.class);

    public final NumberPath<Double> lotSizeMultiplr = createNumber("lotSizeMultiplr", Double.class);

    public final NumberPath<Double> moveTm = createNumber("moveTm", Double.class);

    public final NumberPath<Double> processTm = createNumber("processTm", Double.class);

    public final StringPath processTmTpCd = createString("processTmTpCd");

    public final NumberPath<Double> queueTm = createNumber("queueTm", Double.class);

    public final com.zionex.t3series.web.domain.fp.resource.QResource resource;

    public final com.zionex.t3series.web.domain.fp.route.QRoute route;

    public final NumberPath<Double> setupTm = createNumber("setupTm", Double.class);

    public final NumberPath<Double> stdProcessTm = createNumber("stdProcessTm", Double.class);

    public final StringPath timeUom = createString("timeUom");

    public final NumberPath<Double> transferBatchTm = createNumber("transferBatchTm", Double.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final NumberPath<Double> waitTm = createNumber("waitTm", Double.class);

    public QBor(String variable) {
        this(Bor.class, forVariable(variable), INITS);
    }

    public QBor(Path<? extends Bor> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBor(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBor(PathMetadata metadata, PathInits inits) {
        this(Bor.class, metadata, inits);
    }

    public QBor(Class<? extends Bor> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.resource = inits.isInitialized("resource") ? new com.zionex.t3series.web.domain.fp.resource.QResource(forProperty("resource"), inits.get("resource")) : null;
        this.route = inits.isInitialized("route") ? new com.zionex.t3series.web.domain.fp.route.QRoute(forProperty("route"), inits.get("route")) : null;
    }

}

