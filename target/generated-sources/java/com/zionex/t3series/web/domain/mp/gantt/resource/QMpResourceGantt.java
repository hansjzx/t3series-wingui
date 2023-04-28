package com.zionex.t3series.web.domain.mp.gantt.resource;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QMpResourceGantt is a Querydsl query type for MpResourceGantt
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QMpResourceGantt extends EntityPathBase<MpResourceGantt> {

    private static final long serialVersionUID = -848126512L;

    public static final QMpResourceGantt mpResourceGantt = new QMpResourceGantt("mpResourceGantt");

    public final NumberPath<Double> actHeight = createNumber("actHeight", Double.class);

    public final StringPath activityId = createString("activityId");

    public final DateTimePath<java.time.LocalDateTime> bucketEndDate = createDateTime("bucketEndDate", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> bucketStrtDate = createDateTime("bucketStrtDate", java.time.LocalDateTime.class);

    public final StringPath color = createString("color");

    public final StringPath conbdMainVerDtlId = createString("conbdMainVerDtlId");

    public final StringPath createBy = createString("createBy");

    public final StringPath createDttm = createString("createDttm");

    public final NumberPath<Integer> displaySeq = createNumber("displaySeq", Integer.class);

    public final StringPath dmndId = createString("dmndId");

    public final DateTimePath<java.time.LocalDateTime> endDate = createDateTime("endDate", java.time.LocalDateTime.class);

    public final StringPath id = createString("id");

    public final StringPath inventoryId = createString("inventoryId");

    public final StringPath modifyBy = createString("modifyBy");

    public final StringPath modifyDttm = createString("modifyDttm");

    public final StringPath planorderId = createString("planorderId");

    public final NumberPath<Double> qty = createNumber("qty", Double.class);

    public final StringPath resourceId = createString("resourceId");

    public final StringPath routeId = createString("routeId");

    public final DateTimePath<java.time.LocalDateTime> strtDate = createDateTime("strtDate", java.time.LocalDateTime.class);

    public QMpResourceGantt(String variable) {
        super(MpResourceGantt.class, forVariable(variable));
    }

    public QMpResourceGantt(Path<? extends MpResourceGantt> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMpResourceGantt(PathMetadata metadata) {
        super(MpResourceGantt.class, metadata);
    }

}

