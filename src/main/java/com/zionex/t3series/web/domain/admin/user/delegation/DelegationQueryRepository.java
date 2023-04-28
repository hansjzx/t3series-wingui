package com.zionex.t3series.web.domain.admin.user.delegation;

import static com.zionex.t3series.web.domain.admin.user.QUser.user;
import static com.zionex.t3series.web.domain.admin.user.delegation.QDelegation.delegation;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.StringPath;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zionex.t3series.web.domain.admin.user.QUser;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DelegationQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public List<Delegation> getDelegations(String username, String delegationUsername) {
        QUser delegationUser = new QUser("delegationUser");

        return jpaQueryFactory
                .select(Projections.fields(Delegation.class,
                        delegation.id,
                        user.username.as("userId"),
                        user.displayName.as("displayName"),
                        delegationUser.username.as("delegationUserId"),
                        delegationUser.displayName.as("delegationDisplayName"),
                        delegation.applyStartDttm,
                        delegation.applyEndDttm,
                        delegation.createBy,
                        delegation.createDttm))
                .from(delegation)
                .leftJoin(user).on(delegation.userId.eq(user.id))
                .leftJoin(delegationUser).on(delegation.delegationUserId.eq(delegationUser.id))
                .where(containsParam(user.username, username),
                        containsParam(delegationUser.username, delegationUsername))
                .fetch();
    }

    public List<Delegation> getDelegationsByDelegatedUser(String delegationUsername) {
        QUser delegationUser = new QUser("delegationUser");
        final LocalDateTime now = LocalDateTime.now();

        return jpaQueryFactory
                .select(Projections.fields(Delegation.class,
                        delegation.id,
                        user.username.as("userId"),
                        user.displayName.as("displayName"),
                        delegation.applyStartDttm,
                        delegation.applyEndDttm))
                .from(delegation)
                .leftJoin(user).on(delegation.userId.eq(user.id))
                .leftJoin(delegationUser).on(delegation.delegationUserId.eq(delegationUser.id))
                .where(delegationUser.username.eq(delegationUsername), delegation.applyStartDttm.before(now),
                        delegation.applyEndDttm.after(now))
                .fetch();
    }

    private BooleanExpression containsParam(StringPath stringPath, String param) {
        if (StringUtils.isEmpty(param)) {
            return null;
        }
        return stringPath.toUpperCase().contains(param.toUpperCase());
    }

}
