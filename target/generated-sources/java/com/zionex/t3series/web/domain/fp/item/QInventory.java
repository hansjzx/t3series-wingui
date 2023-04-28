package com.zionex.t3series.web.domain.fp.item;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QInventory is a Querydsl query type for Inventory
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QInventory extends EntityPathBase<Inventory> {

    private static final long serialVersionUID = 1348238221L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QInventory inventory = new QInventory("inventory");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final StringPath altRoutePolicy = createString("altRoutePolicy");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath id = createString("id");

    public final StringPath inventoryCd = createString("inventoryCd");

    public final StringPath inventoryGrpCd = createString("inventoryGrpCd");

    public final StringPath inventoryNm = createString("inventoryNm");

    public final NumberPath<Double> invFenceTm = createNumber("invFenceTm", Double.class);

    public final NumberPath<Double> invKeepingTm = createNumber("invKeepingTm", Double.class);

    public final QItem item;

    public final StringPath itemTpCd = createString("itemTpCd");

    public final com.zionex.t3series.web.domain.fp.organization.QStage stage;

    public final StringPath stockSelectTpCd = createString("stockSelectTpCd");

    public final StringPath stockSplitCombination = createString("stockSplitCombination");

    public final StringPath timeUom = createString("timeUom");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QInventory(String variable) {
        this(Inventory.class, forVariable(variable), INITS);
    }

    public QInventory(Path<? extends Inventory> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QInventory(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QInventory(PathMetadata metadata, PathInits inits) {
        this(Inventory.class, metadata, inits);
    }

    public QInventory(Class<? extends Inventory> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.item = inits.isInitialized("item") ? new QItem(forProperty("item"), inits.get("item")) : null;
        this.stage = inits.isInitialized("stage") ? new com.zionex.t3series.web.domain.fp.organization.QStage(forProperty("stage"), inits.get("stage")) : null;
    }

}

