package com.zionex.t3series.web.domain.admin.code;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QGroupCode is a Querydsl query type for GroupCode
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QGroupCode extends EntityPathBase<GroupCode> {

    private static final long serialVersionUID = 892290018L;

    public static final QGroupCode groupCode = new QGroupCode("groupCode");

    public final com.zionex.t3series.web.util.audit.QBaseEntity _super = new com.zionex.t3series.web.util.audit.QBaseEntity(this);

    public final StringPath attr01Val = createString("attr01Val");

    public final StringPath attr02Val = createString("attr02Val");

    public final StringPath attr03Val = createString("attr03Val");

    public final StringPath attr04Val = createString("attr04Val");

    public final StringPath attr05Val = createString("attr05Val");

    //inherited
    public final StringPath createBy = _super.createBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createDttm = _super.createDttm;

    public final BooleanPath delYn = createBoolean("delYn");

    public final StringPath descrip = createString("descrip");

    public final StringPath grpCd = createString("grpCd");

    public final StringPath grpNm = createString("grpNm");

    public final StringPath id = createString("id");

    //inherited
    public final StringPath modifyBy = _super.modifyBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifyDttm = _super.modifyDttm;

    public final BooleanPath useYn = createBoolean("useYn");

    public QGroupCode(String variable) {
        super(GroupCode.class, forVariable(variable));
    }

    public QGroupCode(Path<? extends GroupCode> path) {
        super(path.getType(), path.getMetadata());
    }

    public QGroupCode(PathMetadata metadata) {
        super(GroupCode.class, metadata);
    }

}

