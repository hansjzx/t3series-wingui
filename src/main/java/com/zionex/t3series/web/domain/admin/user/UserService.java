package com.zionex.t3series.web.domain.admin.user;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.zionex.t3series.util.SecurityUtil;
import com.zionex.t3series.web.ApplicationProperties;
import com.zionex.t3series.web.domain.admin.account.AccountManager;
import com.zionex.t3series.web.domain.admin.log.SystemAccess;
import com.zionex.t3series.web.domain.admin.log.SystemAccessService;
import com.zionex.t3series.web.domain.admin.user.authority.AuthorityService;
import com.zionex.t3series.web.domain.admin.user.group.GroupService;
import com.zionex.t3series.web.domain.admin.user.group.UserGroup;
import com.zionex.t3series.web.domain.admin.user.group.UserGroupService;
import com.zionex.t3series.web.security.authentication.LoginPolicy;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserQueryRepository userQueryRepository;

    private final ApplicationProperties applicationProperties;
    private final AuthorityService authorityService;
    private final SystemAccessService systemAccessService;

    @Autowired
    private AccountManager accountManager;

    @Autowired
    private UserGroupService userGroupService;

    @Autowired
    private LoginPolicy loginPolicy;

    @Autowired
    private GroupService groupService;

    public UserDetails getUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        return (UserDetails) authentication.getPrincipal();
    }

    public boolean checkAdmin(String username) {
        return accountManager.isSystemAdmin(username);
    }

    public Integer getLoginFailCount(String username) {
        User user = getUser(username);
        return user.getLoginFailCount();
    }

    public void incLoginFailCount(String username) {
        User user = getUser(username);
        user.setLoginFailCount(user.getLoginFailCount() + 1);

        userRepository.save(user);
    }

    public void clearLoginFailCount(String username) {
        User user = getUser(username);
        user.setLoginFailCount(0);

        userRepository.save(user);
    }

    public void unlockLogin(String username) {
        this.clearLoginFailCount(username);

        User user = getUser(username);
        user.setEnabled(true);

        userRepository.save(user);
    }

    public void resetPassword(String username) {
        User user = getUser(username);
        user.setPassword(SecurityUtil.encryptPassword(applicationProperties.getAuthentication().getInitialPassword()));
        user.setPasswordExpired(true);
        user.setPasswordModifyDttm(LocalDateTime.now());
        user.setLoginFailCount(0);

        userRepository.save(user);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public List<User> getUsers(String username, String displayName, String uniqueValue, Boolean includeAdmin) {
        List<User> users = userQueryRepository.getUsers(username, displayName, uniqueValue);
        if (users == null) {
            return null;
        }

        if (includeAdmin != null && includeAdmin) {
            return users;
        } else {
            return users
                    .stream()
                    .filter(user -> !accountManager.isSystemAdmin(user.getUsername()))
                    .collect(Collectors.toList());
        }
    }

    public List<User> getSelectableUsers(String groupcode, String username, String displayName) {
        List<User> users = userQueryRepository.getUsers(username, displayName, null);
        if (users == null) {
            return null;
        }

        String grpId = groupService.getGrpId(groupcode);

        boolean existsUserGroup = userGroupService.existsUserGroupByGrpId(grpId);
        if (existsUserGroup) {
            List<UserGroup> userGroups = userGroupService.getUserGroupByGrpId(grpId);
            List<String> unselectableUserIds = userGroups
                    .stream()
                    .map(userGroup -> getUserById(userGroup.getUserId()).getId())
                    .collect(Collectors.toList());
            users.removeIf (user -> unselectableUserIds.contains(user.getId()));
        }

        return users;
    }

    public boolean existsUser(String username) {
        return userRepository.existsByUsername(username);
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public User getUserOrNull(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public User getUser(String username) {
        return userRepository.findByUsername(username).orElse(new User());
    }

    public User saveUser(User user) {
        User checkUser = userRepository.findByUsername(user.getUsername()).orElse(user);
        user.setId(checkUser.getId());

        String displayName = user.getDisplayName();
        if (displayName == null || displayName.isEmpty()) {
            user.setDisplayName(user.getUsername());
        }

        return userRepository.save(user);
    }

    public void saveUsers(List<User> users) {
        userRepository.saveAll(users);

        users.forEach(user -> {
            if (user.getAdminYn()) {
                accountManager.addAdminAuthority(user.getId());
            } else {
                authorityService.deleteAuthority(user.getId(), "ADMIN");
            }
        });
    }

    public void deleteUsers(List<User> users) {
        userRepository.deleteAll(users);
    }

    public void updateLongTermUnvisitedStatus(User user) {
        if (checkAdmin(user.getUsername())) {
            return;
        }
        SystemAccess latestSystemAccess = systemAccessService.getLatestSystemAccessLog(user.getId());
        LocalDateTime latestSystemAccessTime = user.getCreateDttm();
        if (latestSystemAccess != null) {
            latestSystemAccessTime = latestSystemAccess.getAccessDttm();
        }

        if (loginPolicy.isViolateLongTermUnvisitedDays(latestSystemAccessTime)) {
            user.setEnabled(false);
            userRepository.save(user);
        }
        return;
    }

    public void updatePasswordExpiredStatus(User user) {
        LocalDateTime passwordModifyDttm = user.getPasswordModifyDttm();
        if (passwordModifyDttm == null) {
            return;
        }

        if (loginPolicy.isViolateMaxPasswordDays(passwordModifyDttm)) {
            user.setPasswordExpired(true);
            user.setLoginFailCount(0);
            userRepository.save(user);
        }
    }

}
