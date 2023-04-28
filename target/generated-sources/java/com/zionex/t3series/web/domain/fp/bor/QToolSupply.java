package com.zionex.t3series.web.domain.fp.bor;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QToolSupply is a Querydsl query type for ToolSupply
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QToolSupply extends EntityPathBase<ToolSupply> {

    private static final long serialVersionUID = -1206518788L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QToolSupply toolSupply = new QToolSupply("toolSupply");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath id = createString("id");

    public final com.zionex.t3series.web.domain.fp.resource.QResource resource;

    public final NumberPath<Long> supplyCnt = createNumber("supplyCnt", Long.class);

    public final DateTimePath<java.time.LocalDateTime> supplyTs = createDateTime("supplyTs", java.time.LocalDateTime.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QToolSupply(String variable) {
        this(ToolSupply.class, forVariable(variable), INITS);
    }

    public QToolSupply(Path<? extends ToolSupply> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QToolSupply(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QToolSupply(PathMetadata metadata, PathInits inits) {
        this(ToolSupply.class, metadata, inits);
    }

    public QToolSupply(Class<? extends ToolSupply> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.resource = inits.isInitialized("resource") ? new com.zionex.t3series.web.domain.fp.resource.QResource(forProperty("resource"), inits.get("resource")) : null;
    }

}

