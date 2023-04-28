package com.zionex.t3series.web.domain.util.filestorage;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QFileStorage is a Querydsl query type for FileStorage
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QFileStorage extends EntityPathBase<FileStorage> {

    private static final long serialVersionUID = -813761892L;

    public static final QFileStorage fileStorage = new QFileStorage("fileStorage");

    public final StringPath category = createString("category");

    public final StringPath deleteBy = createString("deleteBy");

    public final DateTimePath<java.sql.Timestamp> deleteDttm = createDateTime("deleteDttm", java.sql.Timestamp.class);

    public final StringPath deleteYn = createString("deleteYn");

    public final StringPath fileName = createString("fileName");

    public final StringPath filePath = createString("filePath");

    public final NumberPath<Long> fileSize = createNumber("fileSize", Long.class);

    public final StringPath fileType = createString("fileType");

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final DateTimePath<java.sql.Timestamp> modifyBy = createDateTime("modifyBy", java.sql.Timestamp.class);

    public final DateTimePath<java.sql.Timestamp> modifyDttm = createDateTime("modifyDttm", java.sql.Timestamp.class);

    public final StringPath uploadBy = createString("uploadBy");

    public final DateTimePath<java.sql.Timestamp> uploadDttm = createDateTime("uploadDttm", java.sql.Timestamp.class);

    public final StringPath uploadUuid = createString("uploadUuid");

    public QFileStorage(String variable) {
        super(FileStorage.class, forVariable(variable));
    }

    public QFileStorage(Path<? extends FileStorage> path) {
        super(path.getType(), path.getMetadata());
    }

    public QFileStorage(PathMetadata metadata) {
        super(FileStorage.class, metadata);
    }

}

