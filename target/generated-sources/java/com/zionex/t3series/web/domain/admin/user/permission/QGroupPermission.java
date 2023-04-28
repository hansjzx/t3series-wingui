package com.zionex.t3series.web.domain.admin.user.permission;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QGroupPermission is a Querydsl query type for GroupPermission
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QGroupPermission extends EntityPathBase<GroupPermission> {

    private static final long serialVersionUID = -656092517L;

    public static final QGroupPermission groupPermission = new QGroupPermission("groupPermission");

    public final com.zionex.t3series.web.util.audit.QBaseEntity _super = new com.zionex.t3series.web.util.audit.QBaseEntity(this);

    //inherited
    public final StringPath createBy = _super.createBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createDttm = _super.createDttm;

    public final StringPath grpId = createString("grpId");

    public final StringPath id = createString("id");

    public final StringPath menuId = createString("menuId");

    //inherited
    public final StringPath modifyBy = _super.modifyBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifyDttm = _super.modifyDttm;

    public final StringPath permissionTp = createString("permissionTp");

    public final BooleanPath usability = createBoolean("usability");

    public QGroupPermission(String variable) {
        super(GroupPermission.class, forVariable(variable));
    }

    public QGroupPermission(Path<? extends GroupPermission> path) {
        super(path.getType(), path.getMetadata());
    }

    public QGroupPermission(PathMetadata metadata) {
        super(GroupPermission.class, metadata);
    }

}

