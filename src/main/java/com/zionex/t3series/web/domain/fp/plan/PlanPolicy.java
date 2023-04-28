package com.zionex.t3series.web.domain.fp.plan;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.zionex.t3series.web.util.audit.BaseEntityFP;
import com.zionex.t3series.web.util.converter.BooleanToYNConverter;

import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_FP_PLAN_POLICY")
public class PlanPolicy extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "POLICY_CD")
    private String policyCd;

    @Column(name = "POLICY_NM")
    private String policyNm;

    @Column(name = "REQUIRED_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean requiredYn;

    @Column(name = "DEFAULT_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean defaultYn;

    @Column(name = "SCRIPT_NM")
    private String scriptNm;

}
