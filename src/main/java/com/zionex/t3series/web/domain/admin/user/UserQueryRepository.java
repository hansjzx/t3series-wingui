package com.zionex.t3series.web.domain.admin.user;

import static com.zionex.t3series.web.domain.admin.user.QUser.user;
import static com.zionex.t3series.web.domain.admin.user.authority.QAuthority.authority1;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.StringPath;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class UserQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public List<User> getUsers(String username, String displayName, String uniqueValue) {
        return jpaQueryFactory
                .select(Projections.fields(User.class,
                        user.id,
                        user.username,
                        user.displayName,
                        user.department,
                        user.businessValue,
                        user.uniqueValue,
                        user.email,
                        user.phone,
                        user.address,
                        user.etc,
                        user.enabled,
                        user.passwordExpired,
                        user.loginFailCount,
                        new CaseBuilder()
                                .when(authority1.authority.isNull())
                                .then(false)
                                .otherwise(true).as("adminYn")))
                .from(user)
                .leftJoin(authority1).on(user.id.eq(authority1.userId).and(authority1.authority.eq("ADMIN")))
                .where(containsParam(user.username, username),
                        containsParam(user.displayName, displayName),
                        containsParam(user.uniqueValue, uniqueValue))
                .fetch();
    }

    private BooleanExpression containsParam(StringPath stringPath, String param) {
        if (StringUtils.isEmpty(param)) {
            return null;
        }
        return stringPath.toUpperCase().contains(param.toUpperCase());
    }

}
