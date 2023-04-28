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
@Table(name = "TB_FP_PLAN_POLICY_DTL")
public class PlanPolicyDetail extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "POLICY_CD")
    private String policyCd;
    
    @Column(name = "CATEGORY_CD")
    private String categoryCd;
    
    @Column(name = "ITEM_SEQ")
    private String itemSeq;
    
    @Column(name = "ITEM_VAL")
    private String itemVal;
    
}
