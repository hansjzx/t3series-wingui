package com.zionex.t3series.web.domain.admin.user.preference;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QPreferenceOption is a Querydsl query type for PreferenceOption
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QPreferenceOption extends EntityPathBase<PreferenceOption> {

    private static final long serialVersionUID = 2099180631L;

    public static final QPreferenceOption preferenceOption = new QPreferenceOption("preferenceOption");

    public final com.zionex.t3series.web.util.audit.QBaseEntity _super = new com.zionex.t3series.web.util.audit.QBaseEntity(this);

    //inherited
    public final StringPath createBy = _super.createBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createDttm = _super.createDttm;

    public final StringPath id = createString("id");

    //inherited
    public final StringPath modifyBy = _super.modifyBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifyDttm = _super.modifyDttm;

    public final StringPath optTp = createString("optTp");

    public final StringPath optValue = createString("optValue");

    public final StringPath userPrefMstId = createString("userPrefMstId");

    public QPreferenceOption(String variable) {
        super(PreferenceOption.class, forVariable(variable));
    }

    public QPreferenceOption(Path<? extends PreferenceOption> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPreferenceOption(PathMetadata metadata) {
        super(PreferenceOption.class, metadata);
    }

}

