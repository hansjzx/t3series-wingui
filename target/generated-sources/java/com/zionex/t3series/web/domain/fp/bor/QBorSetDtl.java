package com.zionex.t3series.web.domain.fp.bor;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBorSetDtl is a Querydsl query type for BorSetDtl
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QBorSetDtl extends EntityPathBase<BorSetDtl> {

    private static final long serialVersionUID = 2038518346L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBorSetDtl borSetDtl = new QBorSetDtl("borSetDtl");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final QBorSetMst borSetMst;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descTxt = createString("descTxt");

    public final StringPath id = createString("id");

    public final com.zionex.t3series.web.domain.fp.resource.QResource resource;

    public final StringPath resourceTpCd = createString("resourceTpCd");

    public final com.zionex.t3series.web.domain.fp.route.QRoute route;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QBorSetDtl(String variable) {
        this(BorSetDtl.class, forVariable(variable), INITS);
    }

    public QBorSetDtl(Path<? extends BorSetDtl> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBorSetDtl(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBorSetDtl(PathMetadata metadata, PathInits inits) {
        this(BorSetDtl.class, metadata, inits);
    }

    public QBorSetDtl(Class<? extends BorSetDtl> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.borSetMst = inits.isInitialized("borSetMst") ? new QBorSetMst(forProperty("borSetMst")) : null;
        this.resource = inits.isInitialized("resource") ? new com.zionex.t3series.web.domain.fp.resource.QResource(forProperty("resource"), inits.get("resource")) : null;
        this.route = inits.isInitialized("route") ? new com.zionex.t3series.web.domain.fp.route.QRoute(forProperty("route"), inits.get("route")) : null;
    }

}

