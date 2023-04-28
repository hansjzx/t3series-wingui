package com.zionex.t3series.web.domain.fp.organization;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QStage is a Querydsl query type for Stage
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QStage extends EntityPathBase<Stage> {

    private static final long serialVersionUID = 1015092175L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QStage stage = new QStage("stage");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descTxt = createString("descTxt");

    public final StringPath id = createString("id");

    public final QPlant plant;

    public final StringPath stageCd = createString("stageCd");

    public final StringPath stageNm = createString("stageNm");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QStage(String variable) {
        this(Stage.class, forVariable(variable), INITS);
    }

    public QStage(Path<? extends Stage> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QStage(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QStage(PathMetadata metadata, PathInits inits) {
        this(Stage.class, metadata, inits);
    }

    public QStage(Class<? extends Stage> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.plant = inits.isInitialized("plant") ? new QPlant(forProperty("plant")) : null;
    }

}

