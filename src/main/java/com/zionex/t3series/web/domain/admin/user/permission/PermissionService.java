package com.zionex.t3series.web.domain.admin.user.permission;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.zionex.t3series.web.domain.admin.account.AccountManager;
import com.zionex.t3series.web.domain.admin.menu.Menu;
import com.zionex.t3series.web.domain.admin.menu.MenuService;
import com.zionex.t3series.web.domain.admin.user.UserService;
import com.zionex.t3series.web.view.ViewConfigManager;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final PermissionQueryRepository permissionQueryRepository;

    private final AccountManager accountManager;
    private final UserService userService;
    private final MenuService menuService;

    private final String PERMISSION_TYPE_PREFIX = "PERMISSION_TYPE_";

    public Map<String, Object> getPermissionByMenuCd(String username, String menuCd) {
        ViewConfigManager viewConfigManager = ViewConfigManager.getViewConfigManager();
        List<String> permissionTypes = viewConfigManager.getPermissionTypes();

        Map<String, Object> row = new HashMap<>();
        row.put("username", username);
        row.put("menuCd", menuCd);

        if (!StringUtils.hasText(username) && accountManager.isSystemAdmin(username)) {
            permissionTypes.forEach(type -> row.put(PERMISSION_TYPE_PREFIX + type, true));
        } else {
            permissionTypes.forEach(type -> row.put(PERMISSION_TYPE_PREFIX + type, false));

            if (!menuService.isAdminModuleMenu(menuCd) || menuService.isUserMenus(menuCd)) {
                String userId = userService.getUser(username).getId();
                Map<String, Set<String>> unionPermissions = permissionQueryRepository.getUnionPermissionTypes(userId, menuCd);
                Set<String> unionTypes = unionPermissions.get(menuCd);
                if (unionTypes != null) {
                    unionTypes.forEach(type -> {
                        if (permissionTypes.contains(type)) {
                            row.put(PERMISSION_TYPE_PREFIX + type, true);
                        }
                    });
                }
            }
        }

        return row;
    }

    public List<Map<String, Object>> getPermissions(String username) {
        List<Map<String, Object>> rows = new ArrayList<>();

        ViewConfigManager viewConfigManager = ViewConfigManager.getViewConfigManager();
        List<String> permissionTypes = viewConfigManager.getPermissionTypes();

        String userId = userService.getUser(username).getId();
        if (userId != null) {
            List<Permission> permissions = permissionRepository.findByUserId(userId);

            List<Menu> views = menuService.getUserOpenViews();
            Map<String, String> menuCdMap = views.stream().collect(Collectors.toMap(Menu::getId, Menu::getMenuCd));

            views.forEach(view -> {
                Map<String, Object> row = new HashMap<>();
                row.put("username", username);
                row.put("menuCd", view.getMenuCd());
                permissionTypes.forEach(type -> row.put(PERMISSION_TYPE_PREFIX + type, false));

                permissions
                        .stream()
                        .filter(p -> view.getMenuCd().equals(menuCdMap.get(p.getMenuId())) && permissionTypes.contains(p.getPermissionTp()))
                        .forEach(p -> row.put(PERMISSION_TYPE_PREFIX + p.getPermissionTp(), p.getUsability()));

                rows.add(row);
            });

        }

        return rows;
    }

    public List<Map<String, Object>> getUnionPermissions(String username) {
        String authUsername = userService.getUserDetails().getUsername();

        boolean isAdmin = accountManager.isSystemAdmin(username);
        boolean isLoginUserAdmin = accountManager.isSystemAdmin(authUsername) && !authUsername.equals(username);

        ViewConfigManager viewConfigManager = ViewConfigManager.getViewConfigManager();
        List<String> permissionTypes = viewConfigManager.getPermissionTypes();

        Map<String, Object> defaultPermissions = new HashMap<>();
        permissionTypes.forEach(type -> defaultPermissions.put(PERMISSION_TYPE_PREFIX + type, !StringUtils.hasText(username) && isAdmin));

        List<Map<String, Object>> result = new ArrayList<>();
        Set<String> viewIds = menuService.getOpenViews().stream().map(Menu::getMenuCd).collect(Collectors.toSet());

        Map<String, Set<String>> unionPermissions = new HashMap<>();
        if (!isAdmin) {
            unionPermissions = permissionQueryRepository.getUnionPermissionTypes(userService.getUser(username).getId(), null);
            viewIds = menuService.filterUserMenu(unionPermissions.keySet());
        }

        Map<String, String> parentMenus = new HashMap<>();
        if (isLoginUserAdmin) {
            parentMenus = makeParentMenus(viewIds);
        }

        for (String menuCd : viewIds) {
            Map<String, Object> menuPermissions = new HashMap<>();
            menuPermissions.put("menuCd", menuCd);
            menuPermissions.putAll(defaultPermissions);
            
            if (isLoginUserAdmin) {
                menuPermissions.put("menuGrp", parentMenus.get(menuCd));
            }

            if (!isAdmin) {
                Set<String> unionPermissionTypes = unionPermissions.get(menuCd);
                if (unionPermissionTypes != null) {
                    unionPermissionTypes
                            .stream()
                            .filter(permissionTypes::contains)
                            .forEach(type -> menuPermissions.put(PERMISSION_TYPE_PREFIX + type, true));
                }
            }
            result.add(menuPermissions);
        }

        return result;
    }

    public Map<String, String> makeParentMenus(Set<String> menus) {
        Map<String, String> parentMenus = new HashMap<>();

        Map<String, Menu> menusMap = menuService.getMenusMap();
        Map<String,String> menuCdMap = menuService.getMenuCdMap();

        menus.forEach(menuCd -> {
            Menu menu = menusMap.get(menuCd);
            String parentId = menu.getParentId();
            while (StringUtils.hasText(parentId)) {
                menu = menusMap.get(menuCdMap.get(parentId));
                parentId = menu.getParentId();
            }
            parentMenus.put(menuCd, menu.getMenuCd());
        });

        return parentMenus;
    }

    public List<Permission> getPermissionsByPermissionTp(String userId, String permissionTp) {
        return permissionRepository.findByUserIdAndPermissionTpAndUsabilityTrue(userId, permissionTp);
    }

    public Permission getPermission(String userId, String menuId, String permissionTp) {
        return permissionRepository.findByUserIdAndMenuIdAndPermissionTp(userId, menuId, permissionTp);
    }

    public boolean checkPermission(String userId, String menuCd, String permissionType) {
        String username = userService.getUserDetails().getUsername();
        if (accountManager.isSystemAdmin(username)) {
            return true;
        }

        return permissionQueryRepository.checkPermission(userId, menuCd, permissionType);
    }

    public void saveAllPermission(List<Permission> permissions) {
        permissionRepository.saveAll(permissions);
    }

    public void savePermission(Permission permission) {
        permissionRepository.save(permission);
    }

    public void deletePermissions(List<String> userIds) {
        permissionRepository.deleteByUserIdIn(userIds);
    }

}
