package com.zionex.t3series.web.domain.fp.stock;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QStockInputPlan is a Querydsl query type for StockInputPlan
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QStockInputPlan extends EntityPathBase<StockInputPlan> {

    private static final long serialVersionUID = 657125377L;

    public static final QStockInputPlan stockInputPlan = new QStockInputPlan("stockInputPlan");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final NumberPath<Long> activityId = createNumber("activityId", Long.class);

    public final NumberPath<Double> availQty = createNumber("availQty", Double.class);

    public final DateTimePath<java.time.LocalDateTime> availTs = createDateTime("availTs", java.time.LocalDateTime.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath id = createString("id");

    public final StringPath inventoryCd = createString("inventoryCd");

    public final StringPath plantCd = createString("plantCd");

    public final StringPath routeCd = createString("routeCd");

    public final StringPath stageCd = createString("stageCd");

    public final StringPath stockCd = createString("stockCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final StringPath versionCd = createString("versionCd");

    public final StringPath woCd = createString("woCd");

    public QStockInputPlan(String variable) {
        super(StockInputPlan.class, forVariable(variable));
    }

    public QStockInputPlan(Path<? extends StockInputPlan> path) {
        super(path.getType(), path.getMetadata());
    }

    public QStockInputPlan(PathMetadata metadata) {
        super(StockInputPlan.class, metadata);
    }

}

