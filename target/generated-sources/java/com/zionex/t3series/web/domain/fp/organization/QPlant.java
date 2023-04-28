package com.zionex.t3series.web.domain.fp.organization;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QPlant is a Querydsl query type for Plant
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QPlant extends EntityPathBase<Plant> {

    private static final long serialVersionUID = 1012083516L;

    public static final QPlant plant = new QPlant("plant");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descripText = createString("descripText");

    public final StringPath id = createString("id");

    public final StringPath plantCd = createString("plantCd");

    public final StringPath plantNm = createString("plantNm");

    public final StringPath siteCd = createString("siteCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QPlant(String variable) {
        super(Plant.class, forVariable(variable));
    }

    public QPlant(Path<? extends Plant> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPlant(PathMetadata metadata) {
        super(Plant.class, metadata);
    }

}

