package com.zionex.t3series.web.domain.admin.user.permission;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QServicePermission is a Querydsl query type for ServicePermission
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QServicePermission extends EntityPathBase<ServicePermission> {

    private static final long serialVersionUID = -944648175L;

    public static final QServicePermission servicePermission = new QServicePermission("servicePermission");

    public final com.zionex.t3series.web.util.audit.QBaseEntity _super = new com.zionex.t3series.web.util.audit.QBaseEntity(this);

    //inherited
    public final StringPath createBy = _super.createBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createDttm = _super.createDttm;

    public final StringPath id = createString("id");

    public final StringPath menuId = createString("menuId");

    //inherited
    public final StringPath modifyBy = _super.modifyBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifyDttm = _super.modifyDttm;

    public final StringPath permissionTp = createString("permissionTp");

    public final StringPath serviceId = createString("serviceId");

    public final BooleanPath useYn = createBoolean("useYn");

    public QServicePermission(String variable) {
        super(ServicePermission.class, forVariable(variable));
    }

    public QServicePermission(Path<? extends ServicePermission> path) {
        super(path.getType(), path.getMetadata());
    }

    public QServicePermission(PathMetadata metadata) {
        super(ServicePermission.class, metadata);
    }

}

