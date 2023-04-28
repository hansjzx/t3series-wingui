package com.zionex.t3series.web.domain.fp.calendar;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QCalendarDtl is a Querydsl query type for CalendarDtl
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QCalendarDtl extends EntityPathBase<CalendarDtl> {

    private static final long serialVersionUID = -835420838L;

    public static final QCalendarDtl calendarDtl = new QCalendarDtl("calendarDtl");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final StringPath calendarCd = createString("calendarCd");

    public final StringPath calendarTpCd = createString("calendarTpCd");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descTxt = createString("descTxt");

    public final StringPath displayColor = createString("displayColor");

    public final DatePath<java.time.LocalDate> endDt = createDate("endDt", java.time.LocalDate.class);

    public final StringPath id = createString("id");

    public final StringPath periodCd = createString("periodCd");

    public final NumberPath<Long> priority = createNumber("priority", Long.class);

    public final DatePath<java.time.LocalDate> startDt = createDate("startDt", java.time.LocalDate.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QCalendarDtl(String variable) {
        super(CalendarDtl.class, forVariable(variable));
    }

    public QCalendarDtl(Path<? extends CalendarDtl> path) {
        super(path.getType(), path.getMetadata());
    }

    public QCalendarDtl(PathMetadata metadata) {
        super(CalendarDtl.class, metadata);
    }

}

