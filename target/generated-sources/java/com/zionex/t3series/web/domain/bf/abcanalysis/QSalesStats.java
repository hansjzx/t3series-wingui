package com.zionex.t3series.web.domain.bf.abcanalysis;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QSalesStats is a Querydsl query type for SalesStats
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QSalesStats extends EntityPathBase<SalesStats> {

    private static final long serialVersionUID = 646941813L;

    public static final QSalesStats salesStats = new QSalesStats("salesStats");

    public final com.zionex.t3series.web.util.audit.QBaseEntity _super = new com.zionex.t3series.web.util.audit.QBaseEntity(this);

    //inherited
    public final StringPath createBy = _super.createBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createDttm = _super.createDttm;

    public final StringPath id = createString("id");

    //inherited
    public final StringPath modifyBy = _super.modifyBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifyDttm = _super.modifyDttm;

    public final NumberPath<Float> thldA = createNumber("thldA", Float.class);

    public final NumberPath<Float> thldB = createNumber("thldB", Float.class);

    public final NumberPath<Float> thldX = createNumber("thldX", Float.class);

    public final NumberPath<Float> thldY = createNumber("thldY", Float.class);

    public QSalesStats(String variable) {
        super(SalesStats.class, forVariable(variable));
    }

    public QSalesStats(Path<? extends SalesStats> path) {
        super(path.getType(), path.getMetadata());
    }

    public QSalesStats(PathMetadata metadata) {
        super(SalesStats.class, metadata);
    }

}

