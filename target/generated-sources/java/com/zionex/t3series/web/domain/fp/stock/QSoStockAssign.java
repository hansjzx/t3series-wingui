package com.zionex.t3series.web.domain.fp.stock;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QSoStockAssign is a Querydsl query type for SoStockAssign
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QSoStockAssign extends EntityPathBase<SoStockAssign> {

    private static final long serialVersionUID = -1458464059L;

    public static final QSoStockAssign soStockAssign = new QSoStockAssign("soStockAssign");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final BooleanPath assignYn = createBoolean("assignYn");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath id = createString("id");

    public final StringPath soCd = createString("soCd");

    public final StringPath stockCd = createString("stockCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QSoStockAssign(String variable) {
        super(SoStockAssign.class, forVariable(variable));
    }

    public QSoStockAssign(Path<? extends SoStockAssign> path) {
        super(path.getType(), path.getMetadata());
    }

    public QSoStockAssign(PathMetadata metadata) {
        super(SoStockAssign.class, metadata);
    }

}

