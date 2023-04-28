package com.zionex.t3series.web.domain.fp.wip;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QWipBatch is a Querydsl query type for WipBatch
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QWipBatch extends EntityPathBase<WipBatch> {

    private static final long serialVersionUID = -845564776L;

    public static final QWipBatch wipBatch = new QWipBatch("wipBatch");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final StringPath batchGrpCd = createString("batchGrpCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath id = createString("id");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final NumberPath<Long> wipId = createNumber("wipId", Long.class);

    public QWipBatch(String variable) {
        super(WipBatch.class, forVariable(variable));
    }

    public QWipBatch(Path<? extends WipBatch> path) {
        super(path.getType(), path.getMetadata());
    }

    public QWipBatch(PathMetadata metadata) {
        super(WipBatch.class, metadata);
    }

}

