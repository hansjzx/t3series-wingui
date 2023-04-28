package com.zionex.t3series.web.domain.admin.user.group;

import static com.zionex.t3series.web.domain.admin.user.QUser.user;
import static com.zionex.t3series.web.domain.admin.user.group.QGroup.group;
import static com.zionex.t3series.web.domain.admin.user.group.QUserGroup.userGroup;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class UserGroupQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public List<GroupUserResult> getGroupUsers(String groupCode) {
        return jpaQueryFactory
                .select(Projections.fields(GroupUserResult.class,
                        user.id.as("userId"),
                        user.username,
                        user.displayName,
                        user.department,
                        user.businessValue,
                        group.grpCd))
                .from(userGroup)
                .innerJoin(group).on(userGroup.grpId.eq(group.id).and(group.grpCd.eq(groupCode)))
                .innerJoin(user).on(userGroup.userId.eq(user.id))
                .fetch();
    }

}
