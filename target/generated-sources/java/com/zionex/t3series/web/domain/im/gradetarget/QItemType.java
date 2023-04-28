package com.zionex.t3series.web.domain.im.gradetarget;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QItemType is a Querydsl query type for ItemType
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QItemType extends EntityPathBase<ItemType> {

    private static final long serialVersionUID = -442837403L;

    public static final QItemType itemType = new QItemType("itemType");

    public final BooleanPath actvYn = createBoolean("actvYn");

    public final StringPath confId = createString("confId");

    public final StringPath convnNm = createString("convnNm");

    public final StringPath createBy = createString("createBy");

    public final DateTimePath<java.time.LocalDateTime> createDttm = createDateTime("createDttm", java.time.LocalDateTime.class);

    public final StringPath id = createString("id");

    public final StringPath itemTp = createString("itemTp");

    public final StringPath itemTpCdId = createString("itemTpCdId");

    public final StringPath modifyBy = createString("modifyBy");

    public final DateTimePath<java.time.LocalDateTime> modifyDttm = createDateTime("modifyDttm", java.time.LocalDateTime.class);

    public QItemType(String variable) {
        super(ItemType.class, forVariable(variable));
    }

    public QItemType(Path<? extends ItemType> path) {
        super(path.getType(), path.getMetadata());
    }

    public QItemType(PathMetadata metadata) {
        super(ItemType.class, metadata);
    }

}

