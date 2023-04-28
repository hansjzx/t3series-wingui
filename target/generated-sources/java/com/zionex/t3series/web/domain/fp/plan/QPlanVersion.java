package com.zionex.t3series.web.domain.fp.plan;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QPlanVersion is a Querydsl query type for PlanVersion
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QPlanVersion extends EntityPathBase<PlanVersion> {

    private static final long serialVersionUID = 105984630L;

    public static final QPlanVersion planVersion = new QPlanVersion("planVersion");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final DateTimePath<java.time.LocalDateTime> confirmedAt = createDateTime("confirmedAt", java.time.LocalDateTime.class);

    public final StringPath confirmedBy = createString("confirmedBy");

    public final BooleanPath confirmYn = createBoolean("confirmYn");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descripText = createString("descripText");

    public final DateTimePath<java.time.LocalDateTime> endTs = createDateTime("endTs", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> freezeTs = createDateTime("freezeTs", java.time.LocalDateTime.class);

    public final StringPath id = createString("id");

    public final StringPath mainVersionCd = createString("mainVersionCd");

    public final DatePath<java.time.LocalDate> planDt = createDate("planDt", java.time.LocalDate.class);

    public final StringPath policyCd = createString("policyCd");

    public final DateTimePath<java.time.LocalDateTime> startTs = createDateTime("startTs", java.time.LocalDateTime.class);

    public final StringPath stepCd = createString("stepCd");

    public final NumberPath<Long> stepSeq = createNumber("stepSeq", Long.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final StringPath versionCd = createString("versionCd");

    public final NumberPath<Long> versionSeq = createNumber("versionSeq", Long.class);

    public QPlanVersion(String variable) {
        super(PlanVersion.class, forVariable(variable));
    }

    public QPlanVersion(Path<? extends PlanVersion> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPlanVersion(PathMetadata metadata) {
        super(PlanVersion.class, metadata);
    }

}

