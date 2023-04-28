package com.zionex.t3series.web.domain.fp.item;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QItemGrp is a Querydsl query type for ItemGrp
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QItemGrp extends EntityPathBase<ItemGrp> {

    private static final long serialVersionUID = -1907123389L;

    public static final QItemGrp itemGrp = new QItemGrp("itemGrp");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descTxt = createString("descTxt");

    public final StringPath id = createString("id");

    public final StringPath itemGrpCd = createString("itemGrpCd");

    public final StringPath itemGrpNm = createString("itemGrpNm");

    public final StringPath prodtnLimitCd = createString("prodtnLimitCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QItemGrp(String variable) {
        super(ItemGrp.class, forVariable(variable));
    }

    public QItemGrp(Path<? extends ItemGrp> path) {
        super(path.getType(), path.getMetadata());
    }

    public QItemGrp(PathMetadata metadata) {
        super(ItemGrp.class, metadata);
    }

}

