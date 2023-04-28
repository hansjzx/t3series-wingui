package com.zionex.t3series.web.domain.fp.route;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QRouteGrp is a Querydsl query type for RouteGrp
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QRouteGrp extends EntityPathBase<RouteGrp> {

    private static final long serialVersionUID = 1261595501L;

    public static final QRouteGrp routeGrp = new QRouteGrp("routeGrp");

    public final com.zionex.t3series.web.util.audit.QBaseEntityFP _super = new com.zionex.t3series.web.util.audit.QBaseEntityFP(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final StringPath descTxt = createString("descTxt");

    public final StringPath id = createString("id");

    public final StringPath routeGrpCd = createString("routeGrpCd");

    public final StringPath routeGrpNm = createString("routeGrpNm");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public QRouteGrp(String variable) {
        super(RouteGrp.class, forVariable(variable));
    }

    public QRouteGrp(Path<? extends RouteGrp> path) {
        super(path.getType(), path.getMetadata());
    }

    public QRouteGrp(PathMetadata metadata) {
        super(RouteGrp.class, metadata);
    }

}

