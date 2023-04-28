package com.zionex.t3series.web.domain.fp.bor;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QBorSetMst is a Querydsl query type for BorSetMst
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QBorSetMst extends EntityPathBase<BorSetMst> {

    private static final long serialVersionUID = 2038526972L;

    public static final QBorSetMst borSetMst = new QBorSetMst("borSetMst");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    public final StringPath borSetCd = createString("borSetCd");

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

    public QBorSetMst(String variable) {
        super(BorSetMst.class, forVariable(variable));
    }

    public QBorSetMst(Path<? extends BorSetMst> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBorSetMst(PathMetadata metadata) {
        super(BorSetMst.class, metadata);
    }

}

