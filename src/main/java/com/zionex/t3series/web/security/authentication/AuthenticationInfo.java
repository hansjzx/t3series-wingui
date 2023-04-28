package com.zionex.t3series.web.security.authentication;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthenticationInfo {

    private String token;

    @JsonIgnore
    private String userId;

    private String username;

    private String displayName;

    private String uniqueValue;

    private boolean systemAdmin;

    private boolean passwordExpired;

}
