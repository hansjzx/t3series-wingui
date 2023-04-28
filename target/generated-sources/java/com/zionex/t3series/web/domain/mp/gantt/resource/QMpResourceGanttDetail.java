package com.zionex.t3series.web.domain.mp.gantt.resource;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QMpResourceGanttDetail is a Querydsl query type for MpResourceGanttDetail
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QMpResourceGanttDetail extends EntityPathBase<MpResourceGanttDetail> {

    private static final long serialVersionUID = 388499009L;

    public static final QMpResourceGanttDetail mpResourceGanttDetail = new QMpResourceGanttDetail("mpResourceGanttDetail");

    public final StringPath activityId = createString("activityId");

    public final StringPath id = createString("id");

    public final NumberPath<Double> qty = createNumber("qty", Double.class);

    public final StringPath routeId = createString("routeId");

    public QMpResourceGanttDetail(String variable) {
        super(MpResourceGanttDetail.class, forVariable(variable));
    }

    public QMpResourceGanttDetail(Path<? extends MpResourceGanttDetail> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMpResourceGanttDetail(PathMetadata metadata) {
        super(MpResourceGanttDetail.class, metadata);
    }

}

