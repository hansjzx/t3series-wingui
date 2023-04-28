package com.zionex.t3series.web.domain.admin.log;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QViewExecution is a Querydsl query type for ViewExecution
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QViewExecution extends EntityPathBase<ViewExecution> {

    private static final long serialVersionUID = 1178012562L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QViewExecution viewExecution = new QViewExecution("viewExecution");

    public final DateTimePath<java.time.LocalDateTime> executionDttm = createDateTime("executionDttm", java.time.LocalDateTime.class);

    public final StringPath id = createString("id");

    public final DateTimePath<java.time.LocalDateTime> modifyDttm = createDateTime("modifyDttm", java.time.LocalDateTime.class);

    public final com.zionex.t3series.web.domain.admin.user.QUser user;

    public final StringPath userBrowser = createString("userBrowser");

    public final StringPath userIp = createString("userIp");

    public final StringPath viewCd = createString("viewCd");

    public QViewExecution(String variable) {
        this(ViewExecution.class, forVariable(variable), INITS);
    }

    public QViewExecution(Path<? extends ViewExecution> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QViewExecution(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QViewExecution(PathMetadata metadata, PathInits inits) {
        this(ViewExecution.class, metadata, inits);
    }

    public QViewExecution(Class<? extends ViewExecution> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new com.zionex.t3series.web.domain.admin.user.QUser(forProperty("user")) : null;
    }

}

