package com.zionex.t3series.web.domain.admin.user.preference;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QPreferenceDetail is a Querydsl query type for PreferenceDetail
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QPreferenceDetail extends EntityPathBase<PreferenceDetail> {

    private static final long serialVersionUID = 1774093363L;

    public static final QPreferenceDetail preferenceDetail = new QPreferenceDetail("preferenceDetail");

    public final QPreference _super = new QPreference(this);

    //inherited
    public final BooleanPath applyYn = _super.applyYn;

    //inherited
    public final StringPath categoryGroup = _super.categoryGroup;

    //inherited
    public final StringPath createBy = _super.createBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createDttm = _super.createDttm;

    //inherited
    public final StringPath crosstabItemCd = _super.crosstabItemCd;

    //inherited
    public final BooleanPath crosstabYn = _super.crosstabYn;

    //inherited
    public final BooleanPath dataKeyYn = _super.dataKeyYn;

    //inherited
    public final StringPath dimMeasureTp = _super.dimMeasureTp;

    //inherited
    public final BooleanPath editMeasureYn = _super.editMeasureYn;

    //inherited
    public final BooleanPath editTargetYn = _super.editTargetYn;

    //inherited
    public final BooleanPath fldActiveYn = _super.fldActiveYn;

    //inherited
    public final StringPath fldApplyCd = _super.fldApplyCd;

    //inherited
    public final StringPath fldCd = _super.fldCd;

    //inherited
    public final NumberPath<Integer> fldSeq = _super.fldSeq;

    //inherited
    public final NumberPath<Integer> fldWidth = _super.fldWidth;

    //inherited
    public final StringPath grpId = _super.grpId;

    public final StringPath id = createString("id");

    //inherited
    public final StringPath modifyBy = _super.modifyBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifyDttm = _super.modifyDttm;

    //inherited
    public final StringPath referValue = _super.referValue;

    //inherited
    public final StringPath summaryTp = _super.summaryTp;

    //inherited
    public final BooleanPath summaryYn = _super.summaryYn;

    //inherited
    public final StringPath userPrefMstId = _super.userPrefMstId;

    public QPreferenceDetail(String variable) {
        super(PreferenceDetail.class, forVariable(variable));
    }

    public QPreferenceDetail(Path<? extends PreferenceDetail> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPreferenceDetail(PathMetadata metadata) {
        super(PreferenceDetail.class, metadata);
    }

}

