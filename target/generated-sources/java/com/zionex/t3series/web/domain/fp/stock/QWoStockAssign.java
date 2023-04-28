package com.zionex.t3series.web.domain.fp.stock;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QWoStockAssign is a Querydsl query type for WoStockAssign
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QWoStockAssign extends EntityPathBase<WoStockAssign> {

    private static final long serialVersionUID = 1662891209L;

    public static final QWoStockAssign woStockAssign = new QWoStockAssign("woStockAssign");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final BooleanPath assignYn = createBoolean("assignYn");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath id = createString("id");

    public final StringPath stockCd = createString("stockCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final StringPath woCd = createString("woCd");

    public QWoStockAssign(String variable) {
        super(WoStockAssign.class, forVariable(variable));
    }

    public QWoStockAssign(Path<? extends WoStockAssign> path) {
        super(path.getType(), path.getMetadata());
    }

    public QWoStockAssign(PathMetadata metadata) {
        super(WoStockAssign.class, metadata);
    }

}

