package com.zionex.t3series.web.domain.admin.log;

import static com.zionex.t3series.web.domain.admin.log.QSystemAccess.systemAccess;
import static com.zionex.t3series.web.domain.admin.user.QUser.user;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.StringPath;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SystemAccessQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public Page<SystemAccess> getSystemAccessLog(String displayName, LocalDateTime accessDttmFrom, LocalDateTime accessDttmTo, Pageable pageable) {
        List<SystemAccess> systemAccessLogs = jpaQueryFactory
                .select(Projections.fields(SystemAccess.class,
                        systemAccess.user.displayName,
                        systemAccess.accessIp,
                        systemAccess.accessDttm,
                        systemAccess.logoutDttm))
                .from(systemAccess)
                .innerJoin(user)
                .on(systemAccess.user.id.eq(user.id))
                .where(containsParam(user.displayName, displayName),
                        systemAccess.accessDttm.goe(accessDttmFrom),
                        systemAccess.logoutDttm.loe(accessDttmTo).or(systemAccess.logoutDttm.isNull()))
                .orderBy(systemAccess.accessDttm.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<SystemAccess> totalCount = jpaQueryFactory
                .selectFrom(systemAccess)
                .innerJoin(systemAccess.user, user)
                .fetchJoin()
                .where(containsParam(systemAccess.user.displayName, displayName),
                        systemAccess.accessDttm.goe(accessDttmFrom),
                        systemAccess.logoutDttm.loe(accessDttmTo).or(systemAccess.logoutDttm.isNull()));

        if (systemAccessLogs == null) {
            return null;
        }

        return PageableExecutionUtils.getPage(systemAccessLogs, pageable, totalCount::fetchCount);
    }

    public SystemAccess getLatestSystemAccessLog(String userId) {
        return jpaQueryFactory
                .selectFrom(systemAccess)
                .where(systemAccess.user.id.eq(userId))
                .orderBy(systemAccess.accessDttm.desc())
                .fetchFirst();
    }

    private BooleanExpression containsParam(StringPath stringPath, String param) {
        if (StringUtils.isEmpty(param)) {
            return null;
        }
        return stringPath.toUpperCase().contains(param.toUpperCase());
    }

}
