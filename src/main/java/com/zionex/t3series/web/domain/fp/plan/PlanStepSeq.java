package com.zionex.t3series.web.domain.fp.plan;

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
@Table(name = "TB_FP_PLAN_STEP_SEQ")
public class PlanStepSeq extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "STEP_CD")
    private String stepCd;

    @Column(name = "STEP_SEQ")
    private Long stepSeq;

    @Column(name = "DESC_TXT")
    private String descTxt;

    @Column(name = "EXEC_TP_CD")
    private String execTpCd;

    @Column(name = "EXEC_TARGET")
    private String execTarget;

}
