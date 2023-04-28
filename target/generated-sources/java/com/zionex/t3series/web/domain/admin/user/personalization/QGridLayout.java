package com.zionex.t3series.web.domain.admin.user.personalization;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QGridLayout is a Querydsl query type for GridLayout
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QGridLayout extends EntityPathBase<GridLayout> {

    private static final long serialVersionUID = 936049510L;

    public static final QGridLayout gridLayout1 = new QGridLayout("gridLayout1");

    public final com.zionex.t3series.web.util.audit.QBaseEntity _super = new com.zionex.t3series.web.util.audit.QBaseEntity(this);

    public final StringPath allUser = createString("allUser");

    //inherited
    public final StringPath createBy = _super.createBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createDttm = _super.createDttm;

    public final StringPath gridCode = createString("gridCode");

    public final StringPath gridLayout = createString("gridLayout");

    public final StringPath layoutName = createString("layoutName");

    public final StringPath layoutType = createString("layoutType");

    public final StringPath menuCode = createString("menuCode");

    //inherited
    public final StringPath modifyBy = _super.modifyBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifyDttm = _super.modifyDttm;

    public final DateTimePath<java.time.LocalDateTime> saveDttm = createDateTime("saveDttm", java.time.LocalDateTime.class);

    public final StringPath username = createString("username");

    public QGridLayout(String variable) {
        super(GridLayout.class, forVariable(variable));
    }

    public QGridLayout(Path<? extends GridLayout> path) {
        super(path.getType(), path.getMetadata());
    }

    public QGridLayout(PathMetadata metadata) {
        super(GridLayout.class, metadata);
    }

}

