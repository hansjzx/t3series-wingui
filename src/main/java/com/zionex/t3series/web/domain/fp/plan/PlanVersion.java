package com.zionex.t3series.web.domain.fp.plan;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.zionex.t3series.web.domain.fp.organization.Plant;
import com.zionex.t3series.web.util.audit.BaseEntityFP;

import com.zionex.t3series.web.util.converter.BooleanToYNConverter;
import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_FP_PLAN_VERSION")
public class PlanVersion extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "VERSION_CD")
    private String versionCd;

    @Column(name = "VERSION_SEQ")
    private Long versionSeq;

    @Column(name = "DESC_TXT")
    private String descripText;

    @Column(name = "PLAN_DT")
    private LocalDate planDt;

    @Column(name = "START_TS")
    private LocalDateTime startTs;

    @Column(name = "FREEZE_TS")
    private LocalDateTime freezeTs;

    @Column(name = "END_TS")
    private LocalDateTime endTs;

    @Column(name = "POLICY_CD")
    private String policyCd;

    @Column(name = "STEP_SEQ")
    private Long stepSeq;

    @Column(name = "MAIN_VERSION_CD")
    private String mainVersionCd;

    @Column(name = "STEP_CD")
    private String stepCd;

    @Column(name = "CONFIRM_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean confirmYn;

    @Column(name = "CONFIRMED_BY")
    private String confirmedBy;

    @Column(name = "CONFIRMED_AT")
    private LocalDateTime confirmedAt;

    @Transient
    private List<Plant> plants;
    
    @Transient
    private String stepDescripText;

}
