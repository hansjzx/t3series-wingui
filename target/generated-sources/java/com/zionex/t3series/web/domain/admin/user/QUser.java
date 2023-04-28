package com.zionex.t3series.web.domain.admin.user;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QUser is a Querydsl query type for User
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QUser extends EntityPathBase<User> {

    private static final long serialVersionUID = 1414019095L;

    public static final QUser user = new QUser("user");

    public final com.zionex.t3series.web.util.audit.QBaseEntity _super = new com.zionex.t3series.web.util.audit.QBaseEntity(this);

    public final StringPath address = createString("address");

    public final StringPath businessValue = createString("businessValue");

    //inherited
    public final StringPath createBy = _super.createBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createDttm = _super.createDttm;

    public final StringPath department = createString("department");

    public final StringPath displayName = createString("displayName");

    public final StringPath email = createString("email");

    public final BooleanPath enabled = createBoolean("enabled");

    public final StringPath etc = createString("etc");

    public final StringPath id = createString("id");

    public final NumberPath<Integer> loginFailCount = createNumber("loginFailCount", Integer.class);

    //inherited
    public final StringPath modifyBy = _super.modifyBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifyDttm = _super.modifyDttm;

    public final StringPath password = createString("password");

    public final BooleanPath passwordExpired = createBoolean("passwordExpired");

    public final DateTimePath<java.time.LocalDateTime> passwordModifyDttm = createDateTime("passwordModifyDttm", java.time.LocalDateTime.class);

    public final StringPath phone = createString("phone");

    public final StringPath uniqueValue = createString("uniqueValue");

    public final StringPath username = createString("username");

    public QUser(String variable) {
        super(User.class, forVariable(variable));
    }

    public QUser(Path<? extends User> path) {
        super(path.getType(), path.getMetadata());
    }

    public QUser(PathMetadata metadata) {
        super(User.class, metadata);
    }

}

