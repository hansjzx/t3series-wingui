package com.zionex.t3series.web.domain.mp.gantt.resource;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QComnCode is a Querydsl query type for ComnCode
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QComnCode extends EntityPathBase<ComnCode> {

    private static final long serialVersionUID = -1071996563L;

    public static final QComnCode comnCode = new QComnCode("comnCode");

    public final StringPath attr01Val = createString("attr01Val");

    public final StringPath attr02Val = createString("attr02Val");

    public final StringPath attr03Val = createString("attr03Val");

    public final StringPath attr04Val = createString("attr04Val");

    public final StringPath attr05Val = createString("attr05Val");

    public final StringPath attr06Val = createString("attr06Val");

    public final StringPath attr07Val = createString("attr07Val");

    public final StringPath attr08Val = createString("attr08Val");

    public final StringPath attr09Val = createString("attr09Val");

    public final StringPath attr10Val = createString("attr10Val");

    public final StringPath comnCd = createString("comnCd");

    public final StringPath comnCdNm = createString("comnCdNm");

    public final StringPath createBy = createString("createBy");

    public final DateTimePath<java.time.LocalDateTime> createDttm = createDateTime("createDttm", java.time.LocalDateTime.class);

    public final StringPath defatValYn = createString("defatValYn");

    public final StringPath delYn = createString("delYn");

    public final StringPath descrip = createString("descrip");

    public final StringPath id = createString("id");

    public final StringPath ifVal = createString("ifVal");

    public final StringPath modifyBy = createString("modifyBy");

    public final DateTimePath<java.time.LocalDateTime> modifyDttm = createDateTime("modifyDttm", java.time.LocalDateTime.class);

    public final NumberPath<Double> seq = createNumber("seq", Double.class);

    public final StringPath srcId = createString("srcId");

    public final StringPath useYn = createString("useYn");

    public QComnCode(String variable) {
        super(ComnCode.class, forVariable(variable));
    }

    public QComnCode(Path<? extends ComnCode> path) {
        super(path.getType(), path.getMetadata());
    }

    public QComnCode(PathMetadata metadata) {
        super(ComnCode.class, metadata);
    }

}

