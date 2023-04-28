package com.zionex.t3series.web.domain.fp.plan;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QPlanProblem is a Querydsl query type for PlanProblem
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QPlanProblem extends EntityPathBase<PlanProblem> {

    private static final long serialVersionUID = -555165635L;

    public static final QPlanProblem planProblem = new QPlanProblem("planProblem");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final DateTimePath<java.time.LocalDateTime> dueDate = createDateTime("dueDate", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> endTs = createDateTime("endTs", java.time.LocalDateTime.class);

    public final StringPath id = createString("id");

    public final StringPath inventoryCd = createString("inventoryCd");

    public final StringPath inventoryNm = createString("inventoryNm");

    public final StringPath itemUom = createString("itemUom");

    public final StringPath plantCd = createString("plantCd");

    public final StringPath problemInventoryCd = createString("problemInventoryCd");

    public final StringPath problemInventoryNm = createString("problemInventoryNm");

    public final StringPath problemReasonTypeCd = createString("problemReasonTypeCd");

    public final StringPath problemResourceCd = createString("problemResourceCd");

    public final StringPath problemResourceNm = createString("problemResourceNm");

    public final StringPath problemRouteCd = createString("problemRouteCd");

    public final StringPath problemRouteNm = createString("problemRouteNm");

    public final StringPath problemTypeCd = createString("problemTypeCd");

    public final NumberPath<Double> requestQty = createNumber("requestQty", Double.class);

    public final StringPath stageCd = createString("stageCd");

    public final DateTimePath<java.time.LocalDateTime> startTs = createDateTime("startTs", java.time.LocalDateTime.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final StringPath versionCd = createString("versionCd");

    public final StringPath woCd = createString("woCd");

    public QPlanProblem(String variable) {
        super(PlanProblem.class, forVariable(variable));
    }

    public QPlanProblem(Path<? extends PlanProblem> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPlanProblem(PathMetadata metadata) {
        super(PlanProblem.class, metadata);
    }

}

