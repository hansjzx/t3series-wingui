package com.zionex.t3series.web.domain.im.gradetarget;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QItemMst is a Querydsl query type for ItemMst
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QItemMst extends EntityPathBase<ItemMst> {

    private static final long serialVersionUID = 816992003L;

    public static final QItemMst itemMst = new QItemMst("itemMst");

    public final StringPath attr01 = createString("attr01");

    public final StringPath attr02 = createString("attr02");

    public final StringPath attr03 = createString("attr03");

    public final StringPath attr04 = createString("attr04");

    public final StringPath attr05 = createString("attr05");

    public final StringPath attr06 = createString("attr06");

    public final StringPath attr07 = createString("attr07");

    public final StringPath attr08 = createString("attr08");

    public final StringPath attr09 = createString("attr09");

    public final StringPath attr10 = createString("attr10");

    public final StringPath attr11 = createString("attr11");

    public final StringPath attr12 = createString("attr12");

    public final StringPath attr13 = createString("attr13");

    public final StringPath attr14 = createString("attr14");

    public final StringPath attr15 = createString("attr15");

    public final StringPath attr16 = createString("attr16");

    public final StringPath attr17 = createString("attr17");

    public final StringPath attr18 = createString("attr18");

    public final StringPath attr19 = createString("attr19");

    public final StringPath attr20 = createString("attr20");

    public final StringPath attr21 = createString("attr21");

    public final StringPath attr22 = createString("attr22");

    public final StringPath attr23 = createString("attr23");

    public final StringPath attr24 = createString("attr24");

    public final StringPath attr25 = createString("attr25");

    public final StringPath cov = createString("cov");

    public final StringPath createBy = createString("createBy");

    public final DateTimePath<java.time.LocalDateTime> createDttm = createDateTime("createDttm", java.time.LocalDateTime.class);

    public final StringPath delYn = createString("delYn");

    public final StringPath descrip = createString("descrip");

    public final StringPath displayColor = createString("displayColor");

    public final StringPath dpPlanYn = createString("dpPlanYn");

    public final DateTimePath<java.time.LocalDateTime> eos = createDateTime("eos", java.time.LocalDateTime.class);

    public final StringPath grade = createString("grade");

    public final StringPath gradeModifyBy = createString("gradeModifyBy");

    public final DateTimePath<java.time.LocalDateTime> gradeModifyDttm = createDateTime("gradeModifyDttm", java.time.LocalDateTime.class);

    public final StringPath gradeYn = createString("gradeYn");

    public final StringPath id = createString("id");

    public final StringPath itemCd = createString("itemCd");

    public final StringPath itemNm = createString("itemNm");

    public final StringPath itemTpId = createString("itemTpId");

    public final NumberPath<Double> maxOrderSize = createNumber("maxOrderSize", Double.class);

    public final NumberPath<Double> minOrderSize = createNumber("minOrderSize", Double.class);

    public final StringPath modifyBy = createString("modifyBy");

    public final DateTimePath<java.time.LocalDateTime> modifyDttm = createDateTime("modifyDttm", java.time.LocalDateTime.class);

    public final StringPath parentItemLvId = createString("parentItemLvId");

    public final StringPath parentItemLvIdAd1 = createString("parentItemLvIdAd1");

    public final StringPath parentItemLvIdAd2 = createString("parentItemLvIdAd2");

    public final StringPath parentItemLvIdAd3 = createString("parentItemLvIdAd3");

    public final DateTimePath<java.time.LocalDateTime> rts = createDateTime("rts", java.time.LocalDateTime.class);

    public final StringPath uomId = createString("uomId");

    public QItemMst(String variable) {
        super(ItemMst.class, forVariable(variable));
    }

    public QItemMst(Path<? extends ItemMst> path) {
        super(path.getType(), path.getMetadata());
    }

    public QItemMst(PathMetadata metadata) {
        super(ItemMst.class, metadata);
    }

}

