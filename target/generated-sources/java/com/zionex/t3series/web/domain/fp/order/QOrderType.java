package com.zionex.t3series.web.domain.fp.order;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QOrderType is a Querydsl query type for OrderType
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QOrderType extends EntityPathBase<OrderType> {

    private static final long serialVersionUID = -682368260L;

    public static final QOrderType orderType = new QOrderType("orderType");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final StringPath attrGrpCd = createString("attrGrpCd");

    public final BooleanPath cancOnLateYn = createBoolean("cancOnLateYn");

    public final BooleanPath cancOnShtgYn = createBoolean("cancOnShtgYn");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath id = createString("id");

    public final NumberPath<Double> orderEfficiency = createNumber("orderEfficiency", Double.class);

    public final DateTimePath<java.time.LocalDateTime> orderPst = createDateTime("orderPst", java.time.LocalDateTime.class);

    public final StringPath orderStrategyTpCd = createString("orderStrategyTpCd");

    public final StringPath orderTpCd = createString("orderTpCd");

    public final BooleanPath toStockYn = createBoolean("toStockYn");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QOrderType(String variable) {
        super(OrderType.class, forVariable(variable));
    }

    public QOrderType(Path<? extends OrderType> path) {
        super(path.getType(), path.getMetadata());
    }

    public QOrderType(PathMetadata metadata) {
        super(OrderType.class, metadata);
    }

}

