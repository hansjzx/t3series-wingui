package com.zionex.t3series.web.domain.admin.user.preference;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QPreference is a Querydsl query type for Preference
 */
@Generated("com.querydsl.codegen.SupertypeSerializer")
public class QPreference extends EntityPathBase<Preference> {

    private static final long serialVersionUID = 2054355266L;

    public static final QPreference preference = new QPreference("preference");

    public final com.zionex.t3series.web.util.audit.QBaseEntity _super = new com.zionex.t3series.web.util.audit.QBaseEntity(this);

    public final BooleanPath applyYn = createBoolean("applyYn");

    public final StringPath categoryGroup = createString("categoryGroup");

    //inherited
    public final StringPath createBy = _super.createBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createDttm = _super.createDttm;

    public final StringPath crosstabItemCd = createString("crosstabItemCd");

    public final BooleanPath crosstabYn = createBoolean("crosstabYn");

    public final BooleanPath dataKeyYn = createBoolean("dataKeyYn");

    public final StringPath dimMeasureTp = createString("dimMeasureTp");

    public final BooleanPath editMeasureYn = createBoolean("editMeasureYn");

    public final BooleanPath editTargetYn = createBoolean("editTargetYn");

    public final BooleanPath fldActiveYn = createBoolean("fldActiveYn");

    public final StringPath fldApplyCd = createString("fldApplyCd");

    public final StringPath fldCd = createString("fldCd");

    public final NumberPath<Integer> fldSeq = createNumber("fldSeq", Integer.class);

    public final NumberPath<Integer> fldWidth = createNumber("fldWidth", Integer.class);

    public final StringPath grpId = createString("grpId");

    //inherited
    public final StringPath modifyBy = _super.modifyBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifyDttm = _super.modifyDttm;

    public final StringPath referValue = createString("referValue");

    public final StringPath summaryTp = createString("summaryTp");

    public final BooleanPath summaryYn = createBoolean("summaryYn");

    public final StringPath userPrefMstId = createString("userPrefMstId");

    public QPreference(String variable) {
        super(Preference.class, forVariable(variable));
    }

    public QPreference(Path<? extends Preference> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPreference(PathMetadata metadata) {
        super(Preference.class, metadata);
    }

}

