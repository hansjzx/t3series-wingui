package com.zionex.t3series.web.domain.mp.gantt.resource;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QConbdMainVerDtl is a Querydsl query type for ConbdMainVerDtl
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QConbdMainVerDtl extends EntityPathBase<ConbdMainVerDtl> {

    private static final long serialVersionUID = 785476739L;

    public static final QConbdMainVerDtl conbdMainVerDtl = new QConbdMainVerDtl("conbdMainVerDtl");

    public final StringPath conbdMainVerMstId = createString("conbdMainVerMstId");

    public final StringPath confrmDttm = createString("confrmDttm");

    public final StringPath confrmEmpId = createString("confrmEmpId");

    public final StringPath confrmYn = createString("confrmYn");

    public final StringPath createBy = createString("createBy");

    public final StringPath createDttm = createString("createDttm");

    public final StringPath elapsedTime = createString("elapsedTime");

    public final StringPath endDttm = createString("endDttm");

    public final StringPath err = createString("err");

    public final StringPath exeStatusId = createString("exeStatusId");

    public final StringPath id = createString("id");

    public final StringPath loadEndDttm = createString("loadEndDttm");

    public final StringPath loadStrtDttm = createString("loadStrtDttm");

    public final StringPath modifyBy = createString("modifyBy");

    public final StringPath modifyDttm = createString("modifyDttm");

    public final StringPath planEndDttm = createString("planEndDttm");

    public final StringPath planSnrioMgmtDtlId = createString("planSnrioMgmtDtlId");

    public final StringPath planStrtDttm = createString("planStrtDttm");

    public final StringPath referConbdMainVerDtlId = createString("referConbdMainVerDtlId");

    public final StringPath revisionId = createString("revisionId");

    public final StringPath simulVerDescrip = createString("simulVerDescrip");

    public final StringPath simulVerId = createString("simulVerId");

    public final StringPath stepStatusId = createString("stepStatusId");

    public final StringPath strtDttm = createString("strtDttm");

    public QConbdMainVerDtl(String variable) {
        super(ConbdMainVerDtl.class, forVariable(variable));
    }

    public QConbdMainVerDtl(Path<? extends ConbdMainVerDtl> path) {
        super(path.getType(), path.getMetadata());
    }

    public QConbdMainVerDtl(PathMetadata metadata) {
        super(ConbdMainVerDtl.class, metadata);
    }

}

