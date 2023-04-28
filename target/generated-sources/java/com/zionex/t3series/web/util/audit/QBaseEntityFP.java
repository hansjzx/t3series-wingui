package com.zionex.t3series.web.util.audit;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QBaseEntityFP is a Querydsl query type for BaseEntityFP
 */
@Generated("com.querydsl.codegen.SupertypeSerializer")
public class QBaseEntityFP extends EntityPathBase<BaseEntityFP> {

    private static final long serialVersionUID = 403225579L;

    public static final QBaseEntityFP baseEntityFP = new QBaseEntityFP("baseEntityFP");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final StringPath createdBy = createString("createdBy");

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final StringPath updatedBy = createString("updatedBy");

    public QBaseEntityFP(String variable) {
        super(BaseEntityFP.class, forVariable(variable));
    }

    public QBaseEntityFP(Path<? extends BaseEntityFP> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBaseEntityFP(PathMetadata metadata) {
        super(BaseEntityFP.class, metadata);
    }

}

