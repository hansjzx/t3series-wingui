package com.zionex.t3series.web.domain.util.bulkinsert;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QImportFile is a Querydsl query type for ImportFile
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QImportFile extends EntityPathBase<ImportFile> {

    private static final long serialVersionUID = 444435632L;

    public static final QImportFile importFile = new QImportFile("importFile");

    public final StringPath errorFileYn = createString("errorFileYn");

    public final NumberPath<Integer> fileStorageId = createNumber("fileStorageId", Integer.class);

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final NumberPath<Integer> importJobId = createNumber("importJobId", Integer.class);

    public QImportFile(String variable) {
        super(ImportFile.class, forVariable(variable));
    }

    public QImportFile(Path<? extends ImportFile> path) {
        super(path.getType(), path.getMetadata());
    }

    public QImportFile(PathMetadata metadata) {
        super(ImportFile.class, metadata);
    }

}

