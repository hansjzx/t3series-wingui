package com.zionex.t3series.web.domain.admin.log;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;

import com.zionex.t3series.web.domain.admin.user.User;

import lombok.Data;

@Data
@Entity
@Table(name = "TB_AD_SYSTEM_ACCESS_LOG")
public class SystemAccess {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @ManyToOne
    @JoinColumn(name = "USER_ID")
    private User user;

    @Transient
    private String displayName;

    @Column(name = "ACCESS_IP")
    private String accessIp;

    @Column(name = "ACCESS_DTTM")
    private LocalDateTime accessDttm;

    @Column(name = "LOGOUT_DTTM")
    private LocalDateTime logoutDttm;

}
