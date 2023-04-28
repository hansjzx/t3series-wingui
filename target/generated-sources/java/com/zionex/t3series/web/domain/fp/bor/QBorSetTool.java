package com.zionex.t3series.web.domain.fp.bor;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBorSetTool is a Querydsl query type for BorSetTool
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QBorSetTool extends EntityPathBase<BorSetTool> {

    private static final long serialVersionUID = -1229968662L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBorSetTool borSetTool = new QBorSetTool("borSetTool");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final StringPath borSetCd = createString("borSetCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descTxt = createString("descTxt");

    public final StringPath id = createString("id");

    public final com.zionex.t3series.web.domain.fp.resource.QResource resource;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final NumberPath<Long> usableCnt = createNumber("usableCnt", Long.class);

    public QBorSetTool(String variable) {
        this(BorSetTool.class, forVariable(variable), INITS);
    }

    public QBorSetTool(Path<? extends BorSetTool> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBorSetTool(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBorSetTool(PathMetadata metadata, PathInits inits) {
        this(BorSetTool.class, metadata, inits);
    }

    public QBorSetTool(Class<? extends BorSetTool> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.resource = inits.isInitialized("resource") ? new com.zionex.t3series.web.domain.fp.resource.QResource(forProperty("resource"), inits.get("resource")) : null;
    }

}

