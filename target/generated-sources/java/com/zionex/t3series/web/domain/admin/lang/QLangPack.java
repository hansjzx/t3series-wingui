package com.zionex.t3series.web.domain.admin.lang;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QLangPack is a Querydsl query type for LangPack
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QLangPack extends EntityPathBase<LangPack> {

    private static final long serialVersionUID = -2042259280L;

    public static final QLangPack langPack = new QLangPack("langPack");

    public final com.zionex.t3series.web.util.audit.QBaseEntity _super = new com.zionex.t3series.web.util.audit.QBaseEntity(this);

    //inherited
    public final StringPath createBy = _super.createBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createDttm = _super.createDttm;

    public final StringPath langCd = createString("langCd");

    public final StringPath langKey = createString("langKey");

    public final StringPath langValue = createString("langValue");

    //inherited
    public final StringPath modifyBy = _super.modifyBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifyDttm = _super.modifyDttm;

    public QLangPack(String variable) {
        super(LangPack.class, forVariable(variable));
    }

    public QLangPack(Path<? extends LangPack> path) {
        super(path.getType(), path.getMetadata());
    }

    public QLangPack(PathMetadata metadata) {
        super(LangPack.class, metadata);
    }

}

