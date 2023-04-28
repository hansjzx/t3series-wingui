package com.zionex.t3series.web.domain.mp.gantt.resource;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QLocMgmt is a Querydsl query type for LocMgmt
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QLocMgmt extends EntityPathBase<LocMgmt> {

    private static final long serialVersionUID = 1015402222L;

    public static final QLocMgmt locMgmt = new QLocMgmt("locMgmt");

    public final StringPath actvYn = createString("actvYn");

    public final StringPath adjtPlanTpId = createString("adjtPlanTpId");

    public final StringPath countryCdId = createString("countryCdId");

    public final StringPath createBy = createString("createBy");

    public final DateTimePath<java.time.LocalDateTime> createDttm = createDateTime("createDttm", java.time.LocalDateTime.class);

    public final StringPath custShppYn = createString("custShppYn");

    public final StringPath discrtYn = createString("discrtYn");

    public final StringPath divisblYn = createString("divisblYn");

    public final NumberPath<Double> fixedPrductAdjtPlanHoriz = createNumber("fixedPrductAdjtPlanHoriz", Double.class);

    public final NumberPath<Double> fixedReplshPlanHoriz = createNumber("fixedReplshPlanHoriz", Double.class);

    public final NumberPath<Double> fixedRollPrductPlanHoriz = createNumber("fixedRollPrductPlanHoriz", Double.class);

    public final NumberPath<Double> fixedRollShppPlanHoriz = createNumber("fixedRollShppPlanHoriz", Double.class);

    public final NumberPath<Double> fixedShppAdjtPlanHoriz = createNumber("fixedShppAdjtPlanHoriz", Double.class);

    public final StringPath id = createString("id");

    public final StringPath immediateShipmentYn = createString("immediateShipmentYn");

    public final StringPath incotermsId = createString("incotermsId");

    public final NumberPath<Double> invKeepingCostRate = createNumber("invKeepingCostRate", Double.class);

    public final StringPath invOnhandTpId = createString("invOnhandTpId");

    public final StringPath invOnhandYn = createString("invOnhandYn");

    public final StringPath lgcyPlantCd = createString("lgcyPlantCd");

    public final StringPath locatId = createString("locatId");

    public final StringPath modifyBy = createString("modifyBy");

    public final DateTimePath<java.time.LocalDateTime> modifyDttm = createDateTime("modifyDttm", java.time.LocalDateTime.class);

    public final StringPath outsrcYn = createString("outsrcYn");

    public final StringPath planResTpId = createString("planResTpId");

    public final StringPath poPlanModuleId = createString("poPlanModuleId");

    public final StringPath prductPlanAdjtYn = createString("prductPlanAdjtYn");

    public final StringPath regionCdId = createString("regionCdId");

    public final NumberPath<Double> salesProfitRate = createNumber("salesProfitRate", Double.class);

    public final StringPath semiPrductGiUseYn = createString("semiPrductGiUseYn");

    public final StringPath timeUomId = createString("timeUomId");

    public final StringPath vehiclTpId = createString("vehiclTpId");

    public QLocMgmt(String variable) {
        super(LocMgmt.class, forVariable(variable));
    }

    public QLocMgmt(Path<? extends LocMgmt> path) {
        super(path.getType(), path.getMetadata());
    }

    public QLocMgmt(PathMetadata metadata) {
        super(LocMgmt.class, metadata);
    }

}

