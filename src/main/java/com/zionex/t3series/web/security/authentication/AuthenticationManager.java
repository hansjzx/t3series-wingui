package com.zionex.t3series.web.security.authentication;

import org.springframework.stereotype.Component;

import com.zionex.t3series.web.domain.admin.account.AccountManager;
import com.zionex.t3series.web.domain.admin.user.User;
import com.zionex.t3series.web.domain.admin.user.UserService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthenticationManager {

    private final AccountManager accountManager;
    private final UserService userService;

    public AuthenticationInfo getAuthenticationInfo() {
        String username = userService.getUserDetails().getUsername();
        User user = userService.getUser(username);

        return AuthenticationInfo.builder()
                .userId(user.getId())
                .username(username)
                .displayName(user.getDisplayName())
                .uniqueValue(user.getUniqueValue())
                .systemAdmin(accountManager.isSystemAdmin(username))
                .build();
    }
    
}
