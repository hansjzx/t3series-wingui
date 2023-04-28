package com.zionex.t3series.web.domain.admin.code;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QCode is a Querydsl query type for Code
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QCode extends EntityPathBase<Code> {

    private static final long serialVersionUID = -53068457L;

    public static final QCode code = new QCode("code");

    public final com.zionex.t3series.web.util.audit.QBaseEntity _super = new com.zionex.t3series.web.util.audit.QBaseEntity(this);

    public final StringPath attr01Val = createString("attr01Val");

    public final StringPath attr02Val = createString("attr02Val");

    public final StringPath attr03Val = createString("attr03Val");

    public final StringPath attr04Val = createString("attr04Val");

    public final StringPath attr05Val = createString("attr05Val");

    public final StringPath comnCd = createString("comnCd");

    public final StringPath comnCdNm = createString("comnCdNm");

    //inherited
    public final StringPath createBy = _super.createBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createDttm = _super.createDttm;

    public final BooleanPath defaultValueYn = createBoolean("defaultValueYn");

    public final BooleanPath delYn = createBoolean("delYn");

    public final StringPath descrip = createString("descrip");

    public final StringPath id = createString("id");

    public final StringPath ifVal = createString("ifVal");

    //inherited
    public final StringPath modifyBy = _super.modifyBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifyDttm = _super.modifyDttm;

    public final NumberPath<Integer> seq = createNumber("seq", Integer.class);

    public final StringPath srcId = createString("srcId");

    public final BooleanPath useYn = createBoolean("useYn");

    public QCode(String variable) {
        super(Code.class, forVariable(variable));
    }

    public QCode(Path<? extends Code> path) {
        super(path.getType(), path.getMetadata());
    }

    public QCode(PathMetadata metadata) {
        super(Code.class, metadata);
    }

}

