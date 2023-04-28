package com.zionex.t3series.web.domain.fp.plan;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.zionex.t3series.web.util.audit.BaseEntityFP;

import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_FP_PLAN_PROBLEM")
public class PlanProblem extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "VERSION_CD")
    private String versionCd;

    @Column(name = "PLANT_CD")
    private String plantCd;

    @Transient
    private String plantNm;

    @Column(name = "STAGE_CD")
    private String stageCd;

    @Column(name = "WO_CD")
    private String woCd;

    @Column(name = "PROBLEM_TP_CD")
    private String problemTypeCd;

    @Column(name = "PROBLEM_REASON_TP_CD")
    private String problemReasonTypeCd;

    @Column(name = "INVENTORY_CD")
    private String inventoryCd;

    @Column(name = "INVENTORY_NM")
    private String inventoryNm;

    @Column(name = "ITEM_UOM")
    private String itemUom;

    @Column(name = "REQUEST_QTY")
    private Double requestQty;

    @Column(name = "DUE_DT")
    private LocalDateTime dueDate;

    @Column(name = "START_TS")
    private LocalDateTime startTs;

    @Column(name = "END_TS")
    private LocalDateTime endTs;

    @Column(name = "PROBLEM_INVENTORY_CD")
    private String problemInventoryCd;

    @Column(name = "PROBLEM_INVENTORY_NM")
    private String problemInventoryNm;

    @Column(name = "PROBLEM_ROUTE_CD")
    private String problemRouteCd;

    @Column(name = "PROBLEM_ROUTE_NM")
    private String problemRouteNm;

    @Column(name = "PROBLEM_RESOURCE_CD")
    private String problemResourceCd;

    @Column(name = "PROBLEM_RESOURCE_NM")
    private String problemResourceNm;
    
}
