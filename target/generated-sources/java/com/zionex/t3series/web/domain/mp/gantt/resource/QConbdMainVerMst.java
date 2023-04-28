package com.zionex.t3series.web.domain.mp.gantt.resource;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QConbdMainVerMst is a Querydsl query type for ConbdMainVerMst
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QConbdMainVerMst extends EntityPathBase<ConbdMainVerMst> {

    private static final long serialVersionUID = 785485365L;

    public static final QConbdMainVerMst conbdMainVerMst = new QConbdMainVerMst("conbdMainVerMst");

    public final StringPath createBy = createString("createBy");

    public final StringPath createDttm = createString("createDttm");

    public final StringPath descrip = createString("descrip");

    public final StringPath dmndVerId = createString("dmndVerId");

    public final StringPath id = createString("id");

    public final StringPath mainVerId = createString("mainVerId");

    public final StringPath modifyBy = createString("modifyBy");

    public final StringPath modifyDttm = createString("modifyDttm");

    public final StringPath moduleId = createString("moduleId");

    public final StringPath planHorizEnd = createString("planHorizEnd");

    public final StringPath planHorizStrt = createString("planHorizStrt");

    public final StringPath planSnrioMgmtMstId = createString("planSnrioMgmtMstId");

    public final StringPath srpConbdVerMstId = createString("srpConbdVerMstId");

    public final StringPath timeBukt = createString("timeBukt");

    public final StringPath verDate = createString("verDate");

    public QConbdMainVerMst(String variable) {
        super(ConbdMainVerMst.class, forVariable(variable));
    }

    public QConbdMainVerMst(Path<? extends ConbdMainVerMst> path) {
        super(path.getType(), path.getMetadata());
    }

    public QConbdMainVerMst(PathMetadata metadata) {
        super(ConbdMainVerMst.class, metadata);
    }

}

