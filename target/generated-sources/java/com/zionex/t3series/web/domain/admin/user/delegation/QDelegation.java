package com.zionex.t3series.web.domain.admin.user.delegation;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QDelegation is a Querydsl query type for Delegation
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QDelegation extends EntityPathBase<Delegation> {

    private static final long serialVersionUID = -1718896862L;

    public static final QDelegation delegation = new QDelegation("delegation");

    public final com.zionex.t3series.web.util.audit.QBaseEntity _super = new com.zionex.t3series.web.util.audit.QBaseEntity(this);

    public final DateTimePath<java.time.LocalDateTime> applyEndDttm = createDateTime("applyEndDttm", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> applyStartDttm = createDateTime("applyStartDttm", java.time.LocalDateTime.class);

    //inherited
    public final StringPath createBy = _super.createBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createDttm = _super.createDttm;

    public final StringPath delegationUserId = createString("delegationUserId");

    public final StringPath id = createString("id");

    //inherited
    public final StringPath modifyBy = _super.modifyBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifyDttm = _super.modifyDttm;

    public final StringPath userId = createString("userId");

    public QDelegation(String variable) {
        super(Delegation.class, forVariable(variable));
    }

    public QDelegation(Path<? extends Delegation> path) {
        super(path.getType(), path.getMetadata());
    }

    public QDelegation(PathMetadata metadata) {
        super(Delegation.class, metadata);
    }

}

