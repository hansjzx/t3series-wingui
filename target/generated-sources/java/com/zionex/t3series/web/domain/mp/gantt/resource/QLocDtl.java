package com.zionex.t3series.web.domain.mp.gantt.resource;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QLocDtl is a Querydsl query type for LocDtl
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QLocDtl extends EntityPathBase<LocDtl> {

    private static final long serialVersionUID = -659990001L;

    public static final QLocDtl locDtl = new QLocDtl("locDtl");

    public final StringPath actvYn = createString("actvYn");

    public final StringPath businessUnit = createString("businessUnit");

    public final StringPath createBy = createString("createBy");

    public final DateTimePath<java.time.LocalDateTime> createDttm = createDateTime("createDttm", java.time.LocalDateTime.class);

    public final StringPath displayColor = createString("displayColor");

    public final StringPath id = createString("id");

    public final StringPath inOutFlagId = createString("inOutFlagId");

    public final StringPath locatCd = createString("locatCd");

    public final StringPath locatGrpId = createString("locatGrpId");

    public final StringPath locatMstId = createString("locatMstId");

    public final StringPath locatNm = createString("locatNm");

    public final StringPath modifyBy = createString("modifyBy");

    public final DateTimePath<java.time.LocalDateTime> modifyDttm = createDateTime("modifyDttm", java.time.LocalDateTime.class);

    public QLocDtl(String variable) {
        super(LocDtl.class, forVariable(variable));
    }

    public QLocDtl(Path<? extends LocDtl> path) {
        super(path.getType(), path.getMetadata());
    }

    public QLocDtl(PathMetadata metadata) {
        super(LocDtl.class, metadata);
    }

}

