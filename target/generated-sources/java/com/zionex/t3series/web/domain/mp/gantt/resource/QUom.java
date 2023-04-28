package com.zionex.t3series.web.domain.mp.gantt.resource;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QUom is a Querydsl query type for Uom
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QUom extends EntityPathBase<Uom> {

    private static final long serialVersionUID = 2007264864L;

    public static final QUom uom = new QUom("uom");

    public final StringPath actualRefYn = createString("actualRefYn");

    public final StringPath actvYn = createString("actvYn");

    public final StringPath basePlanUomYn = createString("basePlanUomYn");

    public final StringPath baseWeightUomYn = createString("baseWeightUomYn");

    public final StringPath confId = createString("confId");

    public final StringPath createBy = createString("createBy");

    public final StringPath createDttm = createString("createDttm");

    public final StringPath id = createString("id");

    public final StringPath modifyBy = createString("modifyBy");

    public final StringPath modifyDttm = createString("modifyDttm");

    public final StringPath timeBucketYn = createString("timeBucketYn");

    public final StringPath timeUomYn = createString("timeUomYn");

    public final StringPath uomCd = createString("uomCd");

    public final StringPath uomNm = createString("uomNm");

    public QUom(String variable) {
        super(Uom.class, forVariable(variable));
    }

    public QUom(Path<? extends Uom> path) {
        super(path.getType(), path.getMetadata());
    }

    public QUom(PathMetadata metadata) {
        super(Uom.class, metadata);
    }

}

