package com.zionex.t3series.web.domain.fp.order;

import java.time.LocalDateTime;

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
@Table(name = "TB_FP_WO_PLAN")
public class WoPlan extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "VERSION_CD")
    private String versionCd;

    @Column(name = "PLANT_CD")
    private String plantCd;

    @Column(name = "STAGE_CD")
    private String stageCd;

    @Column(name = "WO_CD")
    private String woCd;

    @Column(name = "SO_CD")
    private String soCd;

    @Column(name = "CUSTOMER_CD")
    private String customerCd;

    @Column(name = "CUSTOMER_NM")
    private String customerNm;

    @Column(name = "SHPT_TS")
    private LocalDateTime shptTs;

    @Column(name = "SHPT_QTY")
    private Double shptQty;

    @Column(name = "START_TS")
    private LocalDateTime startTs;

    @Column(name = "END_TS")
    private LocalDateTime endTs;

    @Column(name = "INVENTORY_CD")
    private String inventoryCd;

    @Column(name = "INVENTORY_NM")
    private String inventoryNm;

    @Column(name = "ITEM_UOM")
    private String itemUom;

    @Column(name = "DUE_DT")
    private LocalDateTime dueDt;

    @Column(name = "LATE_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean lateYn;

    @Column(name = "SHTG_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean shtgYn;

    @Column(name = "PLAN_STATUS_TP_CD")
    private String planStatusTpCd;

    @Column(name = "PLAN_SEQ")
    private Long planSeq;

    @Column(name = "DISPLAY_COLOR")
    private String displayColor;

}
