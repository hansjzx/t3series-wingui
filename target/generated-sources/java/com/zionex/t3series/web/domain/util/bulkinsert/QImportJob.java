package com.zionex.t3series.web.domain.util.bulkinsert;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QImportJob is a Querydsl query type for ImportJob
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QImportJob extends EntityPathBase<ImportJob> {

    private static final long serialVersionUID = -1094038007L;

    public static final QImportJob importJob = new QImportJob("importJob");

    public final StringPath completeYn = createString("completeYn");

    public final DateTimePath<java.sql.Timestamp> endDttm = createDateTime("endDttm", java.sql.Timestamp.class);

    public final NumberPath<Integer> failSum = createNumber("failSum", Integer.class);

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final StringPath importBy = createString("importBy");

    public final NumberPath<Integer> importOption = createNumber("importOption", Integer.class);

    public final StringPath jobDescription = createString("jobDescription");

    public final NumberPath<Integer> jobLevel = createNumber("jobLevel", Integer.class);

    public final StringPath jobModule = createString("jobModule");

    public final NumberPath<Integer> jobStep = createNumber("jobStep", Integer.class);

    public final StringPath jobTable = createString("jobTable");

    public final NumberPath<Integer> separatorOption = createNumber("separatorOption", Integer.class);

    public final DateTimePath<java.sql.Timestamp> startDttm = createDateTime("startDttm", java.sql.Timestamp.class);

    public final NumberPath<Integer> successSum = createNumber("successSum", Integer.class);

    public QImportJob(String variable) {
        super(ImportJob.class, forVariable(variable));
    }

    public QImportJob(Path<? extends ImportJob> path) {
        super(path.getType(), path.getMetadata());
    }

    public QImportJob(PathMetadata metadata) {
        super(ImportJob.class, metadata);
    }

}

