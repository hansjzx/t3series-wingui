package com.zionex.t3series.web.domain.fp.resource;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QResrcUtilization is a Querydsl query type for ResrcUtilization
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QResrcUtilization extends EntityPathBase<ResrcUtilization> {

    private static final long serialVersionUID = 1283043749L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QResrcUtilization resrcUtilization = new QResrcUtilization("resrcUtilization");

    public final NumberPath<Double> availRate = createNumber("availRate", Double.class);

    public final NumberPath<Long> availTm = createNumber("availTm", Long.class);

    public final DateTimePath<java.time.LocalDateTime> endTs = createDateTime("endTs", java.time.LocalDateTime.class);

    public final StringPath id = createString("id");

    public final com.zionex.t3series.web.domain.fp.organization.QPlant plant;

    public final QResource resource;

    public final com.zionex.t3series.web.domain.fp.organization.QStage stage;

    public final DateTimePath<java.time.LocalDateTime> startTs = createDateTime("startTs", java.time.LocalDateTime.class);

    public final StringPath timeUom = createString("timeUom");

    public final NumberPath<Double> usedRate = createNumber("usedRate", Double.class);

    public final NumberPath<Long> usedTm = createNumber("usedTm", Long.class);

    public final StringPath versionCd = createString("versionCd");

    public QResrcUtilization(String variable) {
        this(ResrcUtilization.class, forVariable(variable), INITS);
    }

    public QResrcUtilization(Path<? extends ResrcUtilization> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QResrcUtilization(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QResrcUtilization(PathMetadata metadata, PathInits inits) {
        this(ResrcUtilization.class, metadata, inits);
    }

    public QResrcUtilization(Class<? extends ResrcUtilization> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.plant = inits.isInitialized("plant") ? new com.zionex.t3series.web.domain.fp.organization.QPlant(forProperty("plant")) : null;
        this.resource = inits.isInitialized("resource") ? new QResource(forProperty("resource"), inits.get("resource")) : null;
        this.stage = inits.isInitialized("stage") ? new com.zionex.t3series.web.domain.fp.organization.QStage(forProperty("stage"), inits.get("stage")) : null;
    }

}

