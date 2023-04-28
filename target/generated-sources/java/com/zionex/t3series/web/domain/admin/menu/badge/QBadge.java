package com.zionex.t3series.web.domain.admin.menu.badge;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QBadge is a Querydsl query type for Badge
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QBadge extends EntityPathBase<Badge> {

    private static final long serialVersionUID = -1339033760L;

    public static final QBadge badge = new QBadge("badge");

    public final StringPath badgeContent = createString("badgeContent");

    public final NumberPath<Integer> expiredDays = createNumber("expiredDays", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> expiredDttm = createDateTime("expiredDttm", java.time.LocalDateTime.class);

    public final StringPath menuId = createString("menuId");

    public QBadge(String variable) {
        super(Badge.class, forVariable(variable));
    }

    public QBadge(Path<? extends Badge> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBadge(PathMetadata metadata) {
        super(Badge.class, metadata);
    }

}

