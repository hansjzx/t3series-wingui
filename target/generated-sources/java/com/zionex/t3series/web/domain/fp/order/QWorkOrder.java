package com.zionex.t3series.web.domain.fp.order;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QWorkOrder is a Querydsl query type for WorkOrder
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QWorkOrder extends EntityPathBase<WorkOrder> {

    private static final long serialVersionUID = 784876049L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QWorkOrder workOrder = new QWorkOrder("workOrder");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final BooleanPath activeYn = createBoolean("activeYn");

    public final StringPath attrGrpCd = createString("attrGrpCd");

    public final BooleanPath cancOnLateYn = createBoolean("cancOnLateYn");

    public final BooleanPath cancOnShtgYn = createBoolean("cancOnShtgYn");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath deliveryPolicy = createString("deliveryPolicy");

    public final StringPath descTxt = createString("descTxt");

    public final StringPath displayColor = createString("displayColor");

    public final DateTimePath<java.time.LocalDateTime> dueDt = createDateTime("dueDt", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> dueDtFence = createDateTime("dueDtFence", java.time.LocalDateTime.class);

    public final NumberPath<Double> efficiency = createNumber("efficiency", Double.class);

    public final StringPath grade = createString("grade");

    public final StringPath gradeOperatorCd = createString("gradeOperatorCd");

    public final NumberPath<Long> grpPriority = createNumber("grpPriority", Long.class);

    public final StringPath id = createString("id");

    public final com.zionex.t3series.web.domain.fp.item.QInventory inventory;

    public final NumberPath<Long> neckCnt = createNumber("neckCnt", Long.class);

    public final NumberPath<Long> neckPeriod = createNumber("neckPeriod", Long.class);

    public final StringPath neckPolicy = createString("neckPolicy");

    public final StringPath orderStrategyTpCd = createString("orderStrategyTpCd");

    public final StringPath orderTpCd = createString("orderTpCd");

    public final NumberPath<Long> priority = createNumber("priority", Long.class);

    public final DateTimePath<java.time.LocalDateTime> pst = createDateTime("pst", java.time.LocalDateTime.class);

    public final NumberPath<Double> requestQty = createNumber("requestQty", Double.class);

    public final QSalesOrder salesOrder;

    public final StringPath timeUom = createString("timeUom");

    public final BooleanPath toStockYn = createBoolean("toStockYn");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final StringPath woCd = createString("woCd");

    public QWorkOrder(String variable) {
        this(WorkOrder.class, forVariable(variable), INITS);
    }

    public QWorkOrder(Path<? extends WorkOrder> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QWorkOrder(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QWorkOrder(PathMetadata metadata, PathInits inits) {
        this(WorkOrder.class, metadata, inits);
    }

    public QWorkOrder(Class<? extends WorkOrder> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.inventory = inits.isInitialized("inventory") ? new com.zionex.t3series.web.domain.fp.item.QInventory(forProperty("inventory"), inits.get("inventory")) : null;
        this.salesOrder = inits.isInitialized("salesOrder") ? new QSalesOrder(forProperty("salesOrder"), inits.get("salesOrder")) : null;
    }

}

