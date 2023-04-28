package com.zionex.t3series.web.domain.fp.organization;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QCorporation is a Querydsl query type for Corporation
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QCorporation extends EntityPathBase<Corporation> {

    private static final long serialVersionUID = 958418969L;

    public static final QCorporation corporation = new QCorporation("corporation");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final StringPath corporationCd = createString("corporationCd");

    public final StringPath corporationNm = createString("corporationNm");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descTxt = createString("descTxt");

    public final StringPath id = createString("id");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QCorporation(String variable) {
        super(Corporation.class, forVariable(variable));
    }

    public QCorporation(Path<? extends Corporation> path) {
        super(path.getType(), path.getMetadata());
    }

    public QCorporation(PathMetadata metadata) {
        super(Corporation.class, metadata);
    }

}

