package com.zionex.t3series.web.domain.admin.log;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSystemAccess is a Querydsl query type for SystemAccess
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QSystemAccess extends EntityPathBase<SystemAccess> {

    private static final long serialVersionUID = -434089228L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSystemAccess systemAccess = new QSystemAccess("systemAccess");

    public final DateTimePath<java.time.LocalDateTime> accessDttm = createDateTime("accessDttm", java.time.LocalDateTime.class);

    public final StringPath accessIp = createString("accessIp");

    public final StringPath id = createString("id");

    public final DateTimePath<java.time.LocalDateTime> logoutDttm = createDateTime("logoutDttm", java.time.LocalDateTime.class);

    public final com.zionex.t3series.web.domain.admin.user.QUser user;

    public QSystemAccess(String variable) {
        this(SystemAccess.class, forVariable(variable), INITS);
    }

    public QSystemAccess(Path<? extends SystemAccess> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSystemAccess(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSystemAccess(PathMetadata metadata, PathInits inits) {
        this(SystemAccess.class, metadata, inits);
    }

    public QSystemAccess(Class<? extends SystemAccess> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new com.zionex.t3series.web.domain.admin.user.QUser(forProperty("user")) : null;
    }

}

