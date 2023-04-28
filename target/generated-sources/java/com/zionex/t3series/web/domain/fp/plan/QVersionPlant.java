package com.zionex.t3series.web.domain.fp.plan;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QVersionPlant is a Querydsl query type for VersionPlant
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QVersionPlant extends EntityPathBase<VersionPlant> {

    private static final long serialVersionUID = -1142293428L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QVersionPlant versionPlant = new QVersionPlant("versionPlant");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath id = createString("id");

    public final com.zionex.t3series.web.domain.fp.organization.QPlant plant;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final StringPath versionCd = createString("versionCd");

    public QVersionPlant(String variable) {
        this(VersionPlant.class, forVariable(variable), INITS);
    }

    public QVersionPlant(Path<? extends VersionPlant> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QVersionPlant(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QVersionPlant(PathMetadata metadata, PathInits inits) {
        this(VersionPlant.class, metadata, inits);
    }

    public QVersionPlant(Class<? extends VersionPlant> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.plant = inits.isInitialized("plant") ? new com.zionex.t3series.web.domain.fp.organization.QPlant(forProperty("plant")) : null;
    }

}

