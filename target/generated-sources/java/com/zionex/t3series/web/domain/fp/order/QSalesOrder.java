package com.zionex.t3series.web.domain.fp.order;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSalesOrder is a Querydsl query type for SalesOrder
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QSalesOrder extends EntityPathBase<SalesOrder> {

    private static final long serialVersionUID = 1278693582L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSalesOrder salesOrder = new QSalesOrder("salesOrder");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final BooleanPath activeYn = createBoolean("activeYn");

    public final BooleanPath allowNewWoYn = createBoolean("allowNewWoYn");

    public final StringPath attrGrpCd = createString("attrGrpCd");

    public final BooleanPath cancOnLateYn = createBoolean("cancOnLateYn");

    public final BooleanPath cancOnShtgYn = createBoolean("cancOnShtgYn");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final com.zionex.t3series.web.domain.fp.customer.QCustomer customer;

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

    public final StringPath soCd = createString("soCd");

    public final StringPath soGrpCd = createString("soGrpCd");

    public final StringPath timeUom = createString("timeUom");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QSalesOrder(String variable) {
        this(SalesOrder.class, forVariable(variable), INITS);
    }

    public QSalesOrder(Path<? extends SalesOrder> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSalesOrder(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSalesOrder(PathMetadata metadata, PathInits inits) {
        this(SalesOrder.class, metadata, inits);
    }

    public QSalesOrder(Class<? extends SalesOrder> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.customer = inits.isInitialized("customer") ? new com.zionex.t3series.web.domain.fp.customer.QCustomer(forProperty("customer")) : null;
        this.inventory = inits.isInitialized("inventory") ? new com.zionex.t3series.web.domain.fp.item.QInventory(forProperty("inventory"), inits.get("inventory")) : null;
    }

}

