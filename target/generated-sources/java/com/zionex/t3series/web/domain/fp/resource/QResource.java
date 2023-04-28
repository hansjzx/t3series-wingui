package com.zionex.t3series.web.domain.fp.resource;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QResource is a Querydsl query type for Resource
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QResource extends EntityPathBase<Resource> {

    private static final long serialVersionUID = 2137181986L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QResource resource = new QResource("resource");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final BooleanPath batchResourceYn = createBoolean("batchResourceYn");

    public final StringPath calendarCd = createString("calendarCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descTxt = createString("descTxt");

    public final StringPath displayColor = createString("displayColor");

    public final NumberPath<Long> displaySeq = createNumber("displaySeq", Long.class);

    public final StringPath fifoTpCd = createString("fifoTpCd");

    public final StringPath id = createString("id");

    public final StringPath jcDivideTpCd = createString("jcDivideTpCd");

    public final NumberPath<Long> jcTm = createNumber("jcTm", Long.class);

    public final BooleanPath loadYn = createBoolean("loadYn");

    public final StringPath planLvlTpCd = createString("planLvlTpCd");

    public final StringPath resourceCd = createString("resourceCd");

    public final StringPath resourceNm = createString("resourceNm");

    public final NumberPath<Long> routeGrpJcTm = createNumber("routeGrpJcTm", Long.class);

    public final NumberPath<Long> routeJcTm = createNumber("routeJcTm", Long.class);

    public final com.zionex.t3series.web.domain.fp.organization.QStage stage;

    public final StringPath timeUom = createString("timeUom");

    public final NumberPath<Long> toolCnt = createNumber("toolCnt", Long.class);

    public final BooleanPath toolResourceYn = createBoolean("toolResourceYn");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final NumberPath<Long> virtualResourceCnt = createNumber("virtualResourceCnt", Long.class);

    public QResource(String variable) {
        this(Resource.class, forVariable(variable), INITS);
    }

    public QResource(Path<? extends Resource> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QResource(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QResource(PathMetadata metadata, PathInits inits) {
        this(Resource.class, metadata, inits);
    }

    public QResource(Class<? extends Resource> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.stage = inits.isInitialized("stage") ? new com.zionex.t3series.web.domain.fp.organization.QStage(forProperty("stage"), inits.get("stage")) : null;
    }

}

