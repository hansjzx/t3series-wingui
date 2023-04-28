package com.zionex.t3series.web.domain.fp.plan;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QMainVersion is a Querydsl query type for MainVersion
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QMainVersion extends EntityPathBase<MainVersion> {

    private static final long serialVersionUID = 1788786150L;

    public static final QMainVersion mainVersion = new QMainVersion("mainVersion");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descTxt = createString("descTxt");

    public final DateTimePath<java.time.LocalDateTime> endTs = createDateTime("endTs", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> freezeTs = createDateTime("freezeTs", java.time.LocalDateTime.class);

    public final StringPath id = createString("id");

    public final StringPath mainVersionCd = createString("mainVersionCd");

    public final DatePath<java.time.LocalDate> planDt = createDate("planDt", java.time.LocalDate.class);

    public final DateTimePath<java.time.LocalDateTime> startTs = createDateTime("startTs", java.time.LocalDateTime.class);

    public final StringPath stepCd = createString("stepCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final NumberPath<Long> versionSeq = createNumber("versionSeq", Long.class);

    public QMainVersion(String variable) {
        super(MainVersion.class, forVariable(variable));
    }

    public QMainVersion(Path<? extends MainVersion> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMainVersion(PathMetadata metadata) {
        super(MainVersion.class, metadata);
    }

}

