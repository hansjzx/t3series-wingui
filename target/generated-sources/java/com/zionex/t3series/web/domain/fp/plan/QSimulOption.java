package com.zionex.t3series.web.domain.fp.plan;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QSimulOption is a Querydsl query type for SimulOption
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QSimulOption extends EntityPathBase<SimulOption> {

    private static final long serialVersionUID = 413344970L;

    public static final QSimulOption simulOption = new QSimulOption("simulOption");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final StringPath categoryCd = createString("categoryCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath id = createString("id");

    public final StringPath optnVal = createString("optnVal");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final StringPath versionCd = createString("versionCd");

    public QSimulOption(String variable) {
        super(SimulOption.class, forVariable(variable));
    }

    public QSimulOption(Path<? extends SimulOption> path) {
        super(path.getType(), path.getMetadata());
    }

    public QSimulOption(PathMetadata metadata) {
        super(SimulOption.class, metadata);
    }

}

