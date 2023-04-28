package com.zionex.t3series.web.domain.admin.auth;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.security.authentication.AuthenticationInfo;
import com.zionex.t3series.web.security.authentication.AuthenticationManager;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;

    @GetMapping("/auth-info")
    public AuthenticationInfo getAuthenticationInfo(HttpServletRequest request) {
        return authenticationManager.getAuthenticationInfo();
    }

}
