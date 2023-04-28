package com.zionex.t3series.web.domain.admin.user.permission;

import static com.querydsl.core.group.GroupBy.groupBy;
import static com.querydsl.core.group.GroupBy.set;
import static com.zionex.t3series.web.domain.admin.menu.QMenu.menu;
import static com.zionex.t3series.web.domain.admin.user.QUser.user;
import static com.zionex.t3series.web.domain.admin.user.delegation.QDelegation.delegation;
import static com.zionex.t3series.web.domain.admin.user.group.QGroup.group;
import static com.zionex.t3series.web.domain.admin.user.group.QUserGroup.userGroup;
import static com.zionex.t3series.web.domain.admin.user.permission.QGroupPermission.groupPermission;
import static com.zionex.t3series.web.domain.admin.user.permission.QPermission.permission;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.StringPath;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PermissionQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public boolean checkPermission(String userId, String menuCd, String permissionType) {
        List<String> userIds = jpaQueryFactory.select(delegation.userId)
                .from(delegation)
                .where(delegation.delegationUserId.eq(userId))
                .fetch();
        userIds.add(userId);

        List<Boolean> userPermission = jpaQueryFactory.select(permission.usability)
                .from(permission)
                .innerJoin(user).on(permission.userId.eq(user.id).and(user.id.in(userIds)))
                .innerJoin(menu).on(permission.menuId.eq(menu.id).and(menu.menuCd.eq(menuCd)))
                .where(permission.permissionTp.eq(permissionType).and(permission.usability.eq(true)))
                .fetch();

        if (userPermission.contains(true)) {
            return true;
        }

        List<Boolean> userGroupPermission = jpaQueryFactory.select(groupPermission.usability)
                .from(groupPermission)
                .innerJoin(menu).on(groupPermission.menuId.eq(menu.id).and(menu.menuCd.eq(menuCd)))
                .innerJoin(group).on(groupPermission.grpId.eq(group.id).and(group.id.in(jpaQueryFactory
                        .select(userGroup.grpId)
                        .from(userGroup)
                        .where(userGroup.userId.in(userIds))
                        .fetch())))
                .where(groupPermission.permissionTp.eq(permissionType).and(groupPermission.usability.eq(true)))
                .fetch();

        return userGroupPermission.contains(true);
    }

    public Map<String, Set<String>> getUnionPermissionTypes(String userId, String menuCd) {
        List<String> userIds = jpaQueryFactory.select(delegation.userId)
                .from(delegation)
                .where(delegation.delegationUserId.eq(userId))
                .fetch();
        userIds.add(userId);

        Map<String, Set<String>> userPermission = jpaQueryFactory
                .select(Projections.fields(Permission.class,
                        menu.menuCd,
                        permission.permissionTp))
                .from(permission)
                .innerJoin(user).on(permission.userId.eq(user.id).and(user.id.in(userIds)))
                .innerJoin(menu).on(permission.menuId.eq(menu.id).and(equalsParam(menu.menuCd, menuCd)).and(menu.useYn.eq(true)))
                .where(permission.usability.eq(true))
                .transform(groupBy(menu.menuCd).as(set(permission.permissionTp)));

        Map<String, Set<String>> userGroupPermission = jpaQueryFactory
                .select(Projections.fields(GroupPermission.class,
                        menu.menuCd,
                        permission.permissionTp))
                .from(groupPermission)
                .innerJoin(menu).on(groupPermission.menuId.eq(menu.id).and(equalsParam(menu.menuCd, menuCd)).and(menu.useYn.eq(true)))
                .innerJoin(group).on(groupPermission.grpId.eq(group.id)
                        .and(group.id.in(jpaQueryFactory
                                .select(userGroup.grpId)
                                .from(userGroup)
                                .where(userGroup.userId.in(userIds))
                                .fetch())))
                .where(groupPermission.usability.eq(true))
                .transform(groupBy(menu.menuCd).as(set(groupPermission.permissionTp)));

        userGroupPermission.forEach((key, value) -> userPermission.merge(key, value, (v1, v2) -> {
            Set<String> set = new TreeSet<>(v1);
            set.addAll(v2);
            return set;
        }));

        return userPermission;
    }

    private BooleanExpression equalsParam(StringPath stringPath, String param) {
        if (StringUtils.isEmpty(param)) {
            return null;
        }
        return stringPath.eq(param);
    }

}
