package com.zionex.t3series.web.domain.fp.plan;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.zionex.t3series.web.util.audit.BaseEntityFP;

import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_FP_PLAN_STATUS")
public class PlanStatus extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "VERSION_CD")
    private String versionCd;
    
    @Column(name = "START_TS")
    private LocalDateTime startTs;
    
    @Column(name = "END_TS")
    private LocalDateTime endTs;
    
    @Column(name = "STATUS_TP_CD")
    private String statusTypeCd;

    @Column(name = "STATUS_LOG")
    private String statusLog;
    
}
