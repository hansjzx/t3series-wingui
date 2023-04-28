package com.zionex.t3series.web.domain.fp.wip;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QWipResrc is a Querydsl query type for WipResrc
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QWipResrc extends EntityPathBase<WipResrc> {

    private static final long serialVersionUID = -830669777L;

    public static final QWipResrc wipResrc = new QWipResrc("wipResrc");

    public final StringPath id = createString("id");

    public final StringPath resourceCd = createString("resourceCd");

    public final NumberPath<Long> wipId = createNumber("wipId", Long.class);

    public QWipResrc(String variable) {
        super(WipResrc.class, forVariable(variable));
    }

    public QWipResrc(Path<? extends WipResrc> path) {
        super(path.getType(), path.getMetadata());
    }

    public QWipResrc(PathMetadata metadata) {
        super(WipResrc.class, metadata);
    }

}

