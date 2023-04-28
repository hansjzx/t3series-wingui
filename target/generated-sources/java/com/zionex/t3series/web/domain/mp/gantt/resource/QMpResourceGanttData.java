package com.zionex.t3series.web.domain.mp.gantt.resource;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QMpResourceGanttData is a Querydsl query type for MpResourceGanttData
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QMpResourceGanttData extends EntityPathBase<MpResourceGanttData> {

    private static final long serialVersionUID = 1953470874L;

    public static final QMpResourceGanttData mpResourceGanttData = new QMpResourceGanttData("mpResourceGanttData");

    public final NumberPath<Double> actHeight = createNumber("actHeight", Double.class);

    public final DateTimePath<java.time.LocalDateTime> bucketEndDate = createDateTime("bucketEndDate", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> bucketStrtDate = createDateTime("bucketStrtDate", java.time.LocalDateTime.class);

    public final StringPath color = createString("color");

    public final NumberPath<Integer> displaySeq = createNumber("displaySeq", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> endDate = createDateTime("endDate", java.time.LocalDateTime.class);

    public final StringPath id = createString("id");

    public final StringPath inventoryId = createString("inventoryId");

    public final StringPath planorderId = createString("planorderId");

    public final NumberPath<Double> qty = createNumber("qty", Double.class);

    public final StringPath resourceId = createString("resourceId");

    public final DateTimePath<java.time.LocalDateTime> strtDate = createDateTime("strtDate", java.time.LocalDateTime.class);

    public QMpResourceGanttData(String variable) {
        super(MpResourceGanttData.class, forVariable(variable));
    }

    public QMpResourceGanttData(Path<? extends MpResourceGanttData> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMpResourceGanttData(PathMetadata metadata) {
        super(MpResourceGanttData.class, metadata);
    }

}

