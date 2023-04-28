package com.zionex.t3series.web.domain.mp.gantt.resource;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@DynamicUpdate
@Entity
@Table(name = "TB_CM_LOC_MGMT")
public class LocMgmt {
    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @JsonProperty("ID")
    @Column(name = "ID")
    private String id;

    @JsonProperty("ID")
    @Column(name = "LOCAT_ID")
    private String locatId;

    @JsonProperty("LGCY_PLANT_CD")
    @Column(name = "LGCY_PLANT_CD")
    private String lgcyPlantCd;

    @JsonProperty("REGION_CD_ID")
    @Column(name = "REGION_CD_ID")
    private String regionCdId;

    @JsonProperty("COUNTRY_CD_ID")
    @Column(name = "COUNTRY_CD_ID")
    private String countryCdId;

    @JsonProperty("ACTV_YN")
    @Column(name = "ACTV_YN")
    private String actvYn;

    @JsonProperty("OUTSRC_YN")
    @Column(name = "OUTSRC_YN")
    private String outsrcYn;

    @JsonProperty("DISCRT_YN")
    @Column(name = "DISCRT_YN")
    private String discrtYn;

    @JsonProperty("DIVISBL_YN")
    @Column(name = "DIVISBL_YN")
    private String divisblYn;

    @JsonProperty("PLAN_RES_TP_ID")
    @Column(name = "PLAN_RES_TP_ID")
    private String planResTpId;

    @JsonProperty("CUST_SHPP_YN")
    @Column(name = "CUST_SHPP_YN")
    private String custShppYn;

    @JsonProperty("VEHICL_TP_ID")
    @Column(name = "VEHICL_TP_ID")
    private String vehiclTpId;

    @JsonProperty("INCOTERMS_ID")
    @Column(name = "INCOTERMS_ID")
    private String incotermsId;

    @JsonProperty("ID")
    @Column(name = "SALES_PROFIT_RATE")
    private Double salesProfitRate;

    @JsonProperty("INV_ONHAND_TP_ID")
    @Column(name = "INV_ONHAND_TP_ID")
    private String invOnhandTpId;

    @JsonProperty("INV_ONHAND_YN")
    @Column(name = "INV_ONHAND_YN")
    private String invOnhandYn;

    @JsonProperty("INV_KEEPING_COST_RATE")
    @Column(name = "INV_KEEPING_COST_RATE")
    private Double invKeepingCostRate;

    @JsonProperty("FIXED_ROLL_PRDUCT_PLAN_HORIZ")
    @Column(name = "FIXED_ROLL_PRDUCT_PLAN_HORIZ")
    private Double fixedRollPrductPlanHoriz;

    @JsonProperty("FIXED_REPLSH_PLAN_HORIZ")
    @Column(name = "FIXED_REPLSH_PLAN_HORIZ")
    private Double fixedReplshPlanHoriz;

    @JsonProperty("CREATE_BY")
    @Column(name = "CREATE_BY")
    private String createBy;

    @JsonProperty("CREATE_DTTM")
    @Column(name = "CREATE_DTTM")
    private LocalDateTime createDttm;

    @JsonProperty("MODIFY_BY")
    @Column(name = "MODIFY_BY")
    private String modifyBy;

    @JsonProperty("MODIFY_DTTM")
    @Column(name = "MODIFY_DTTM")
    private LocalDateTime modifyDttm;

    @JsonProperty("PO_PLAN_MODULE_ID")
    @Column(name = "PO_PLAN_MODULE_ID")
    private String poPlanModuleId;

    @JsonProperty("TIME_UOM_ID")
    @Column(name = "TIME_UOM_ID")
    private String timeUomId;

    @JsonProperty("FIXED_ROLL_SHPP_PLAN_HORIZ")
    @Column(name = "FIXED_ROLL_SHPP_PLAN_HORIZ")
    private Double fixedRollShppPlanHoriz;

    @JsonProperty("ADJT_PLAN_TP_ID")
    @Column(name = "ADJT_PLAN_TP_ID")
    private String adjtPlanTpId;

    @JsonProperty("FIXED_PRDUCT_ADJT_PLAN_HORIZ")
    @Column(name = "FIXED_PRDUCT_ADJT_PLAN_HORIZ")
    private Double fixedPrductAdjtPlanHoriz;

    @JsonProperty("FIXED_SHPP_ADJT_PLAN_HORIZ")
    @Column(name = "FIXED_SHPP_ADJT_PLAN_HORIZ")
    private Double fixedShppAdjtPlanHoriz;

    @JsonProperty("PRDUCT_PLAN_ADJT_YN")
    @Column(name = "PRDUCT_PLAN_ADJT_YN")
    private String prductPlanAdjtYn;

    @JsonProperty("SEMI_PRDUCT_GI_USE_YN")
    @Column(name = "SEMI_PRDUCT_GI_USE_YN")
    private String semiPrductGiUseYn;

    @JsonProperty("IMMEDIATE_SHIPMENT_YN")
    @Column(name = "IMMEDIATE_SHIPMENT_YN")
    private String immediateShipmentYn;

}
