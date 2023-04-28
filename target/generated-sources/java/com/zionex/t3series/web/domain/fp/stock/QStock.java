package com.zionex.t3series.web.domain.fp.stock;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QStock is a Querydsl query type for Stock
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QStock extends EntityPathBase<Stock> {

    private static final long serialVersionUID = 1879239218L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QStock stock = new QStock("stock");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final BooleanPath activeYn = createBoolean("activeYn");

    public final StringPath attrGrpCd = createString("attrGrpCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descTxt = createString("descTxt");

    public final DateTimePath<java.time.LocalDateTime> expireTs = createDateTime("expireTs", java.time.LocalDateTime.class);

    public final StringPath grade = createString("grade");

    public final StringPath id = createString("id");

    public final StringPath infiniteTpCd = createString("infiniteTpCd");

    public final com.zionex.t3series.web.domain.fp.item.QInventory inventory;

    public final NumberPath<Long> priority = createNumber("priority", Long.class);

    public final StringPath projectionInventoryCd = createString("projectionInventoryCd");

    public final StringPath projectionWoCd = createString("projectionWoCd");

    public final DateTimePath<java.time.LocalDateTime> projectionWoDueDt = createDateTime("projectionWoDueDt", java.time.LocalDateTime.class);

    public final NumberPath<Double> qty = createNumber("qty", Double.class);

    public final DateTimePath<java.time.LocalDateTime> receiptTs = createDateTime("receiptTs", java.time.LocalDateTime.class);

    public final StringPath stockCd = createString("stockCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final DateTimePath<java.time.LocalDateTime> usableTs = createDateTime("usableTs", java.time.LocalDateTime.class);

    public QStock(String variable) {
        this(Stock.class, forVariable(variable), INITS);
    }

    public QStock(Path<? extends Stock> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QStock(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QStock(PathMetadata metadata, PathInits inits) {
        this(Stock.class, metadata, inits);
    }

    public QStock(Class<? extends Stock> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.inventory = inits.isInitialized("inventory") ? new com.zionex.t3series.web.domain.fp.item.QInventory(forProperty("inventory"), inits.get("inventory")) : null;
    }

}

