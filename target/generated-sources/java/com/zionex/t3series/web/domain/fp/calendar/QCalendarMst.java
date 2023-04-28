package com.zionex.t3series.web.domain.fp.calendar;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QCalendarMst is a Querydsl query type for CalendarMst
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QCalendarMst extends EntityPathBase<CalendarMst> {

    private static final long serialVersionUID = -835412212L;

    public static final QCalendarMst calendarMst = new QCalendarMst("calendarMst");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final StringPath calendarCd = createString("calendarCd");

    public final StringPath calendarNm = createString("calendarNm");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descTxt = createString("descTxt");

    public final StringPath id = createString("id");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QCalendarMst(String variable) {
        super(CalendarMst.class, forVariable(variable));
    }

    public QCalendarMst(Path<? extends CalendarMst> path) {
        super(path.getType(), path.getMetadata());
    }

    public QCalendarMst(PathMetadata metadata) {
        super(CalendarMst.class, metadata);
    }

}

