package com.zionex.t3series.web.domain.mp.gantt.resource;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QMpResourceHolidays is a Querydsl query type for MpResourceHolidays
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QMpResourceHolidays extends EntityPathBase<MpResourceHolidays> {

    private static final long serialVersionUID = 1970846751L;

    public static final QMpResourceHolidays mpResourceHolidays = new QMpResourceHolidays("mpResourceHolidays");

    public final StringPath conbdMainVerDtlId = createString("conbdMainVerDtlId");

    public final StringPath createBy = createString("createBy");

    public final StringPath createDttm = createString("createDttm");

    public final StringPath endDate = createString("endDate");

    public final StringPath id = createString("id");

    public final StringPath modifyBy = createString("modifyBy");

    public final StringPath modifyDttm = createString("modifyDttm");

    public final StringPath resourceId = createString("resourceId");

    public final StringPath strtDate = createString("strtDate");

    public QMpResourceHolidays(String variable) {
        super(MpResourceHolidays.class, forVariable(variable));
    }

    public QMpResourceHolidays(Path<? extends MpResourceHolidays> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMpResourceHolidays(PathMetadata metadata) {
        super(MpResourceHolidays.class, metadata);
    }

}

