package com.zionex.t3series.web.domain.util.noticeboard;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QNoticeBoard is a Querydsl query type for NoticeBoard
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QNoticeBoard extends EntityPathBase<NoticeBoard> {

    private static final long serialVersionUID = -909148358L;

    public static final QNoticeBoard noticeBoard = new QNoticeBoard("noticeBoard");

    public final StringPath content = createString("content");

    public final StringPath createBy = createString("createBy");

    public final DateTimePath<java.time.LocalDateTime> createDttm = createDateTime("createDttm", java.time.LocalDateTime.class);

    public final StringPath deleteBy = createString("deleteBy");

    public final DateTimePath<java.time.LocalDateTime> deleteDttm = createDateTime("deleteDttm", java.time.LocalDateTime.class);

    public final StringPath deleteYn = createString("deleteYn");

    public final StringPath id = createString("id");

    public final StringPath modifyBy = createString("modifyBy");

    public final DateTimePath<java.time.LocalDateTime> modifyDttm = createDateTime("modifyDttm", java.time.LocalDateTime.class);

    public final StringPath noticeYn = createString("noticeYn");

    public final StringPath title = createString("title");

    public QNoticeBoard(String variable) {
        super(NoticeBoard.class, forVariable(variable));
    }

    public QNoticeBoard(Path<? extends NoticeBoard> path) {
        super(path.getType(), path.getMetadata());
    }

    public QNoticeBoard(PathMetadata metadata) {
        super(NoticeBoard.class, metadata);
    }

}

