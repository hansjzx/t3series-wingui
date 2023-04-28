package com.zionex.t3series.web.domain.mp.gantt.resource;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QMpPlanHorizon is a Querydsl query type for MpPlanHorizon
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QMpPlanHorizon extends EntityPathBase<MpPlanHorizon> {

    private static final long serialVersionUID = -1892361828L;

    public static final QMpPlanHorizon mpPlanHorizon = new QMpPlanHorizon("mpPlanHorizon");

    public final StringPath baseBucketUom = createString("baseBucketUom");

    public final StringPath descrip = createString("descrip");

    public final StringPath endTime = createString("endTime");

    public final StringPath resCd = createString("resCd");

    public final StringPath simulVerId = createString("simulVerId");

    public final StringPath zone1Start = createString("zone1Start");

    public final StringPath zone2Start = createString("zone2Start");

    public QMpPlanHorizon(String variable) {
        super(MpPlanHorizon.class, forVariable(variable));
    }

    public QMpPlanHorizon(Path<? extends MpPlanHorizon> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMpPlanHorizon(PathMetadata metadata) {
        super(MpPlanHorizon.class, metadata);
    }

}

