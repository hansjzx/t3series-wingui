package com.zionex.t3series.web.domain.fp.stock;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QStockOutputPlan is a Querydsl query type for StockOutputPlan
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QStockOutputPlan extends EntityPathBase<StockOutputPlan> {

    private static final long serialVersionUID = 544464796L;

    public static final QStockOutputPlan stockOutputPlan = new QStockOutputPlan("stockOutputPlan");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final NumberPath<Long> activityId = createNumber("activityId", Long.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath id = createString("id");

    public final StringPath inventoryCd = createString("inventoryCd");

    public final StringPath plantCd = createString("plantCd");

    public final StringPath stageCd = createString("stageCd");

    public final StringPath stockCd = createString("stockCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final NumberPath<Double> usedQty = createNumber("usedQty", Double.class);

    public final DateTimePath<java.time.LocalDateTime> usedTs = createDateTime("usedTs", java.time.LocalDateTime.class);

    public final StringPath versionCd = createString("versionCd");

    public final StringPath woCd = createString("woCd");

    public QStockOutputPlan(String variable) {
        super(StockOutputPlan.class, forVariable(variable));
    }

    public QStockOutputPlan(Path<? extends StockOutputPlan> path) {
        super(path.getType(), path.getMetadata());
    }

    public QStockOutputPlan(PathMetadata metadata) {
        super(StockOutputPlan.class, metadata);
    }

}

