package com.zionex.t3series.web.domain.util.noticeboard;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QNoticeBoardFile is a Querydsl query type for NoticeBoardFile
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QNoticeBoardFile extends EntityPathBase<NoticeBoardFile> {

    private static final long serialVersionUID = 1263188950L;

    public static final QNoticeBoardFile noticeBoardFile = new QNoticeBoardFile("noticeBoardFile");

    public final StringPath boardId = createString("boardId");

    public final NumberPath<Integer> fileStorageId = createNumber("fileStorageId", Integer.class);

    public final StringPath id = createString("id");

    public QNoticeBoardFile(String variable) {
        super(NoticeBoardFile.class, forVariable(variable));
    }

    public QNoticeBoardFile(Path<? extends NoticeBoardFile> path) {
        super(path.getType(), path.getMetadata());
    }

    public QNoticeBoardFile(PathMetadata metadata) {
        super(NoticeBoardFile.class, metadata);
    }

}

