package com.zionex.t3series.web.domain.mp.gantt.resource;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QHorizonTimeBucket is a Querydsl query type for HorizonTimeBucket
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QHorizonTimeBucket extends EntityPathBase<HorizonTimeBucket> {

    private static final long serialVersionUID = 319830431L;

    public static final QHorizonTimeBucket horizonTimeBucket = new QHorizonTimeBucket("horizonTimeBucket");

    public final StringPath actvYn = createString("actvYn");

    public final StringPath bucketTpVal = createString("bucketTpVal");

    public final StringPath confId = createString("confId");

    public final StringPath createBy = createString("createBy");

    public final StringPath createDttm = createString("createDttm");

    public final StringPath dayOfWeekId = createString("dayOfWeekId");

    public final StringPath descrip = createString("descrip");

    public final NumberPath<Double> dura = createNumber("dura", Double.class);

    public final NumberPath<Double> dura2 = createNumber("dura2", Double.class);

    public final StringPath endDate = createString("endDate");

    public final StringPath id = createString("id");

    public final StringPath modifyBy = createString("modifyBy");

    public final StringPath modifyDttm = createString("modifyDttm");

    public final StringPath planSnrioMgmtMstId = createString("planSnrioMgmtMstId");

    public final StringPath strtDate = createString("strtDate");

    public final StringPath strtDate2 = createString("strtDate2");

    public final StringPath strtDateTpId = createString("strtDateTpId");

    public final StringPath strtTime = createString("strtTime");

    public final StringPath timeUomId = createString("timeUomId");

    public final StringPath varTimeUomId = createString("varTimeUomId");

    public QHorizonTimeBucket(String variable) {
        super(HorizonTimeBucket.class, forVariable(variable));
    }

    public QHorizonTimeBucket(Path<? extends HorizonTimeBucket> path) {
        super(path.getType(), path.getMetadata());
    }

    public QHorizonTimeBucket(PathMetadata metadata) {
        super(HorizonTimeBucket.class, metadata);
    }

}

