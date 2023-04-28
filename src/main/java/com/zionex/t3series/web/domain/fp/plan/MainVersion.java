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
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_FP_MAIN_VERSION")
public class MainVersion extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "MAIN_VERSION_CD")
    private String mainVersionCd;

    @Column(name = "DESC_TXT")
    private String descTxt;

    @Column(name = "VERSION_SEQ")
    private Long versionSeq;

    @Column(name = "PLAN_DT")
    private LocalDate planDt;

    @Column(name = "START_TS")
    private LocalDateTime startTs;

    @Column(name = "FREEZE_TS")
    private LocalDateTime freezeTs;

    @Column(name = "END_TS")
    private LocalDateTime endTs;

    @Column(name = "STEP_CD")
    private String stepCd;
    
}
