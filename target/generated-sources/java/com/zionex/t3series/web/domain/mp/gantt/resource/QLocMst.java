package com.zionex.t3series.web.domain.mp.gantt.resource;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QLocMst is a Querydsl query type for LocMst
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QLocMst extends EntityPathBase<LocMst> {

    private static final long serialVersionUID = -659981375L;

    public static final QLocMst locMst = new QLocMst("locMst");

    public final StringPath actvYn = createString("actvYn");

    public final StringPath confId = createString("confId");

    public final StringPath corporId = createString("corporId");

    public final StringPath createBy = createString("createBy");

    public final DateTimePath<java.time.LocalDateTime> createDttm = createDateTime("createDttm", java.time.LocalDateTime.class);

    public final StringPath dmndIntgYn = createString("dmndIntgYn");

    public final StringPath id = createString("id");

    public final StringPath invPolicyTargetYn = createString("invPolicyTargetYn");

    public final NumberPath<Double> locatLv = createNumber("locatLv", Double.class);

    public final StringPath locatLvDescrip = createString("locatLvDescrip");

    public final StringPath locatTpId = createString("locatTpId");

    public final StringPath modifyBy = createString("modifyBy");

    public final DateTimePath<java.time.LocalDateTime> modifyDttm = createDateTime("modifyDttm", java.time.LocalDateTime.class);

    public QLocMst(String variable) {
        super(LocMst.class, forVariable(variable));
    }

    public QLocMst(Path<? extends LocMst> path) {
        super(path.getType(), path.getMetadata());
    }

    public QLocMst(PathMetadata metadata) {
        super(LocMst.class, metadata);
    }

}

