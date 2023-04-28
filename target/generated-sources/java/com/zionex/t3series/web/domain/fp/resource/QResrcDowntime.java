package com.zionex.t3series.web.domain.fp.resource;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QResrcDowntime is a Querydsl query type for ResrcDowntime
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QResrcDowntime extends EntityPathBase<ResrcDowntime> {

    private static final long serialVersionUID = -1469564468L;

    public static final QResrcDowntime resrcDowntime = new QResrcDowntime("resrcDowntime");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descTxt = createString("descTxt");

    public final StringPath displayColor = createString("displayColor");

    public final DateTimePath<java.time.LocalDateTime> endTs = createDateTime("endTs", java.time.LocalDateTime.class);

    public final StringPath id = createString("id");

    public final StringPath plantCd = createString("plantCd");

    public final StringPath resourceCd = createString("resourceCd");

    public final StringPath stageCd = createString("stageCd");

    public final DateTimePath<java.time.LocalDateTime> startTs = createDateTime("startTs", java.time.LocalDateTime.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final StringPath versionCd = createString("versionCd");

    public final NumberPath<Long> virtualResourceSeq = createNumber("virtualResourceSeq", Long.class);

    public QResrcDowntime(String variable) {
        super(ResrcDowntime.class, forVariable(variable));
    }

    public QResrcDowntime(Path<? extends ResrcDowntime> path) {
        super(path.getType(), path.getMetadata());
    }

    public QResrcDowntime(PathMetadata metadata) {
        super(ResrcDowntime.class, metadata);
    }

}

