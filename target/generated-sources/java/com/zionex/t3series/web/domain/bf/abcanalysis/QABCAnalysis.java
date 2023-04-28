package com.zionex.t3series.web.domain.bf.abcanalysis;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QABCAnalysis is a Querydsl query type for ABCAnalysis
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QABCAnalysis extends EntityPathBase<ABCAnalysis> {

    private static final long serialVersionUID = 1388806172L;

    public static final QABCAnalysis aBCAnalysis = new QABCAnalysis("aBCAnalysis");

    public final com.zionex.t3series.web.util.audit.QBaseEntity _super = new com.zionex.t3series.web.util.audit.QBaseEntity(this);

    public final StringPath accountCd = createString("accountCd");

    public final StringPath activeYN = createString("activeYN");

    public final StringPath createBy = createString("createBy");

    public final DateTimePath<java.time.LocalDateTime> createDttm = createDateTime("createDttm", java.time.LocalDateTime.class);

    public final StringPath id = createString("id");

    public final StringPath itemCd = createString("itemCd");

    public final StringPath itemLvCd = createString("itemLvCd");

    //inherited
    public final StringPath modifyBy = _super.modifyBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifyDttm = _super.modifyDttm;

    public final StringPath salesLvCd = createString("salesLvCd");

    public QABCAnalysis(String variable) {
        super(ABCAnalysis.class, forVariable(variable));
    }

    public QABCAnalysis(Path<? extends ABCAnalysis> path) {
        super(path.getType(), path.getMetadata());
    }

    public QABCAnalysis(PathMetadata metadata) {
        super(ABCAnalysis.class, metadata);
    }

}

