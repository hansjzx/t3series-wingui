package com.zionex.t3series.web.domain.admin.user.preference;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QPreferenceMaster is a Querydsl query type for PreferenceMaster
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QPreferenceMaster extends EntityPathBase<PreferenceMaster> {

    private static final long serialVersionUID = 2028049988L;

    public static final QPreferenceMaster preferenceMaster = new QPreferenceMaster("preferenceMaster");

    public final com.zionex.t3series.web.util.audit.QBaseEntity _super = new com.zionex.t3series.web.util.audit.QBaseEntity(this);

    public final BooleanPath autoCreateYn = createBoolean("autoCreateYn");

    //inherited
    public final StringPath createBy = _super.createBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createDttm = _super.createDttm;

    public final StringPath crosstabTp = createString("crosstabTp");

    public final StringPath gridCd = createString("gridCd");

    public final StringPath gridDescrip = createString("gridDescrip");

    public final StringPath id = createString("id");

    //inherited
    public final StringPath modifyBy = _super.modifyBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifyDttm = _super.modifyDttm;

    public final StringPath viewCd = createString("viewCd");

    public QPreferenceMaster(String variable) {
        super(PreferenceMaster.class, forVariable(variable));
    }

    public QPreferenceMaster(Path<? extends PreferenceMaster> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPreferenceMaster(PathMetadata metadata) {
        super(PreferenceMaster.class, metadata);
    }

}

