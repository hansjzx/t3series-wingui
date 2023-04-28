package com.zionex.t3series.web.domain.mp.gantt.resource;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QMpResourceHoliday is a Querydsl query type for MpResourceHoliday
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QMpResourceHoliday extends EntityPathBase<MpResourceHoliday> {

    private static final long serialVersionUID = -2014634284L;

    public static final QMpResourceHoliday mpResourceHoliday = new QMpResourceHoliday("mpResourceHoliday");

    public final StringPath endDate = createString("endDate");

    public final StringPath resourceId = createString("resourceId");

    public final StringPath strtDate = createString("strtDate");

    public QMpResourceHoliday(String variable) {
        super(MpResourceHoliday.class, forVariable(variable));
    }

    public QMpResourceHoliday(Path<? extends MpResourceHoliday> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMpResourceHoliday(PathMetadata metadata) {
        super(MpResourceHoliday.class, metadata);
    }

}

