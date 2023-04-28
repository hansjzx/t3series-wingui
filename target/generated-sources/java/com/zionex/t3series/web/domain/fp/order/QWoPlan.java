package com.zionex.t3series.web.domain.fp.order;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QWoPlan is a Querydsl query type for WoPlan
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QWoPlan extends EntityPathBase<WoPlan> {

    private static final long serialVersionUID = -825060531L;

    public static final QWoPlan woPlan = new QWoPlan("woPlan");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath customerCd = createString("customerCd");

    public final StringPath customerNm = createString("customerNm");

    public final StringPath displayColor = createString("displayColor");

    public final DateTimePath<java.time.LocalDateTime> dueDt = createDateTime("dueDt", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> endTs = createDateTime("endTs", java.time.LocalDateTime.class);

    public final StringPath id = createString("id");

    public final StringPath inventoryCd = createString("inventoryCd");

    public final StringPath inventoryNm = createString("inventoryNm");

    public final StringPath itemUom = createString("itemUom");

    public final BooleanPath lateYn = createBoolean("lateYn");

    public final NumberPath<Long> planSeq = createNumber("planSeq", Long.class);

    public final StringPath planStatusTpCd = createString("planStatusTpCd");

    public final StringPath plantCd = createString("plantCd");

    public final NumberPath<Double> shptQty = createNumber("shptQty", Double.class);

    public final DateTimePath<java.time.LocalDateTime> shptTs = createDateTime("shptTs", java.time.LocalDateTime.class);

    public final BooleanPath shtgYn = createBoolean("shtgYn");

    public final StringPath soCd = createString("soCd");

    public final StringPath stageCd = createString("stageCd");

    public final DateTimePath<java.time.LocalDateTime> startTs = createDateTime("startTs", java.time.LocalDateTime.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final StringPath versionCd = createString("versionCd");

    public final StringPath woCd = createString("woCd");

    public QWoPlan(String variable) {
        super(WoPlan.class, forVariable(variable));
    }

    public QWoPlan(Path<? extends WoPlan> path) {
        super(path.getType(), path.getMetadata());
    }

    public QWoPlan(PathMetadata metadata) {
        super(WoPlan.class, metadata);
    }

}

