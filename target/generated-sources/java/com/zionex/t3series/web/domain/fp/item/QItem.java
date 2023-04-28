package com.zionex.t3series.web.domain.fp.item;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QItem is a Querydsl query type for Item
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QItem extends EntityPathBase<Item> {

    private static final long serialVersionUID = -940917182L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QItem item = new QItem("item");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descTxt = createString("descTxt");

    public final StringPath displayColor = createString("displayColor");

    public final NumberPath<Integer> displaySeq = createNumber("displaySeq", Integer.class);

    public final DatePath<java.time.LocalDate> eol = createDate("eol", java.time.LocalDate.class);

    public final StringPath id = createString("id");

    public final StringPath itemCd = createString("itemCd");

    public final StringPath itemClassCd = createString("itemClassCd");

    public final QItemGrp itemGrp;

    public final StringPath itemNm = createString("itemNm");

    public final StringPath itemUom = createString("itemUom");

    public final NumberPath<Long> priority = createNumber("priority", Long.class);

    public final StringPath prodtnLimitCd = createString("prodtnLimitCd");

    public final DatePath<java.time.LocalDate> sol = createDate("sol", java.time.LocalDate.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final NumberPath<Double> woSieMultiplr = createNumber("woSieMultiplr", Double.class);

    public final NumberPath<Double> woSizeMax = createNumber("woSizeMax", Double.class);

    public final NumberPath<Double> woSizeMin = createNumber("woSizeMin", Double.class);

    public QItem(String variable) {
        this(Item.class, forVariable(variable), INITS);
    }

    public QItem(Path<? extends Item> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QItem(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QItem(PathMetadata metadata, PathInits inits) {
        this(Item.class, metadata, inits);
    }

    public QItem(Class<? extends Item> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.itemGrp = inits.isInitialized("itemGrp") ? new QItemGrp(forProperty("itemGrp")) : null;
    }

}

