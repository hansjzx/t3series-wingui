package com.zionex.t3series.web.domain.fp.bom;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBomRouting is a Querydsl query type for BomRouting
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QBomRouting extends EntityPathBase<BomRouting> {

    private static final long serialVersionUID = 1696126816L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBomRouting bomRouting = new QBomRouting("bomRouting");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final NumberPath<Double> altVal = createNumber("altVal", Double.class);

    public final NumberPath<Double> bomRate = createNumber("bomRate", Double.class);

    public final StringPath bomTpCd = createString("bomTpCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath id = createString("id");

    public final StringPath inputTpCd = createString("inputTpCd");

    public final com.zionex.t3series.web.domain.fp.item.QInventory inventory;

    public final NumberPath<Long> priority = createNumber("priority", Long.class);

    public final com.zionex.t3series.web.domain.fp.route.QRoute route;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QBomRouting(String variable) {
        this(BomRouting.class, forVariable(variable), INITS);
    }

    public QBomRouting(Path<? extends BomRouting> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBomRouting(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBomRouting(PathMetadata metadata, PathInits inits) {
        this(BomRouting.class, metadata, inits);
    }

    public QBomRouting(Class<? extends BomRouting> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.inventory = inits.isInitialized("inventory") ? new com.zionex.t3series.web.domain.fp.item.QInventory(forProperty("inventory"), inits.get("inventory")) : null;
        this.route = inits.isInitialized("route") ? new com.zionex.t3series.web.domain.fp.route.QRoute(forProperty("route"), inits.get("route")) : null;
    }

}

