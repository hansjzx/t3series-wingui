package com.zionex.t3series.web.domain.fp.plan;

import com.zionex.t3series.web.util.audit.BaseEntityFP;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_FP_PLAN_HISTORY")
public class PlanHistory extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "MAIN_VERSION_CD")
    private String mainVersionCd;

    @Column(name = "VERSION_CD")
    private String versionCd;

    @Column(name = "STEP_CD")
    private String stepCd;

    @Column(name = "STEP_SEQ")
    private Long stepSeq;

    @Column(name = "DESC_TXT")
    private String descTxt;

    @Column(name = "START_TS")
    private LocalDateTime startTs;

    @Column(name = "END_TS")
    private LocalDateTime endTs;

    @Column(name = "STATUS_TP_CD")
    private String statusTpCd;

    @Column(name = "STATUS_LOG")
    private String statusLog;
    
}
