package com.zionex.t3series.web.domain.admin.menu;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QMenu is a Querydsl query type for Menu
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QMenu extends EntityPathBase<Menu> {

    private static final long serialVersionUID = -452520809L;

    public static final QMenu menu = new QMenu("menu");

    public final com.zionex.t3series.web.util.audit.QBaseEntity _super = new com.zionex.t3series.web.util.audit.QBaseEntity(this);

    //inherited
    public final StringPath createBy = _super.createBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createDttm = _super.createDttm;

    public final StringPath id = createString("id");

    public final StringPath menuCd = createString("menuCd");

    public final StringPath menuFilePath = createString("menuFilePath");

    public final StringPath menuIcon = createString("menuIcon");

    public final StringPath menuPath = createString("menuPath");

    public final NumberPath<Integer> menuSeq = createNumber("menuSeq", Integer.class);

    public final StringPath menuTp = createString("menuTp");

    //inherited
    public final StringPath modifyBy = _super.modifyBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifyDttm = _super.modifyDttm;

    public final StringPath parentId = createString("parentId");

    public final BooleanPath useYn = createBoolean("useYn");

    public QMenu(String variable) {
        super(Menu.class, forVariable(variable));
    }

    public QMenu(Path<? extends Menu> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMenu(PathMetadata metadata) {
        super(Menu.class, metadata);
    }

}

