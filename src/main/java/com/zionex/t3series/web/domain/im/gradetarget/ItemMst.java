package com.zionex.t3series.web.domain.im.gradetarget;

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
@Table(name = "TB_CM_ITEM_MST")
public class ItemMst {
    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @JsonProperty("ID")
    @Column(name = "ID")
    private String id;

    @JsonProperty("ITEM_CD")
    @Column(name = "ITEM_CD")
    private String itemCd;

    @JsonProperty("ITEM_NM")
    @Column(name = "ITEM_NM")
    private String itemNm;

    @JsonProperty("ITEM_TP_ID")
    @Column(name = "ITEM_TP_ID")
    private String itemTpId;

    @JsonProperty("UOM_ID")
    @Column(name = "UOM_ID")
    private String uomId;

    @JsonProperty("DESCRIP")
    @Column(name = "DESCRIP")
    private String descrip;

    @JsonProperty("DP_PLAN_YN")
    @Column(name = "DP_PLAN_YN")
    private String dpPlanYn;

    @JsonProperty("MIN_ORDER_SIZE")
    @Column(name = "MIN_ORDER_SIZE")
    private Double minOrderSize = 0d;

    @JsonProperty("MAX_ORDER_SIZE")
    @Column(name = "MAX_ORDER_SIZE")
    private Double maxOrderSize = 0d;

    @JsonProperty("RTS")
    @Column(name = "RTS")
    private LocalDateTime rts;

    @JsonProperty("EOS")
    @Column(name = "EOS")
    private LocalDateTime eos;

    @JsonProperty("PARENT_ITEM_LV_ID")
    @Column(name = "PARENT_ITEM_LV_ID")
    private String parentItemLvId;

    @JsonProperty("GRADE_YN")
    @Column(name = "GRADE_YN")
    private String gradeYn;

    @JsonProperty("DISPLAY_COLOR")
    @Column(name = "DISPLAY_COLOR")
    private String displayColor;

    @JsonProperty("PARENT_ITEM_LV_ID_AD1")
    @Column(name = "PARENT_ITEM_LV_ID_AD1")
    private String parentItemLvIdAd1;

    @JsonProperty("PARENT_ITEM_LV_ID_AD2")
    @Column(name = "PARENT_ITEM_LV_ID_AD2")
    private String parentItemLvIdAd2;

    @JsonProperty("PARENT_ITEM_LV_ID_AD3")
    @Column(name = "PARENT_ITEM_LV_ID_AD3")
    private String parentItemLvIdAd3;

    @JsonProperty("GRADE")
    @Column(name = "GRADE")
    private String grade;

    @JsonProperty("COV")
    @Column(name = "COV")
    private String cov;

    @JsonProperty("ATTR_01")
    @Column(name = "ATTR_01")
    private String attr01;

    @JsonProperty("ATTR_02")
    @Column(name = "ATTR_02")
    private String attr02;

    @JsonProperty("ATTR_03")
    @Column(name = "ATTR_03")
    private String attr03;

    @JsonProperty("ATTR_04")
    @Column(name = "ATTR_04")
    private String attr04;

    @JsonProperty("ATTR_05")
    @Column(name = "ATTR_05")
    private String attr05;

    @JsonProperty("ATTR_06")
    @Column(name = "ATTR_06")
    private String attr06;

    @JsonProperty("ATTR_07")
    @Column(name = "ATTR_07")
    private String attr07;

    @JsonProperty("ATTR_08")
    @Column(name = "ATTR_08")
    private String attr08;

    @JsonProperty("ATTR_09")
    @Column(name = "ATTR_09")
    private String attr09;

    @JsonProperty("ATTR_10")
    @Column(name = "ATTR_10")
    private String attr10;

    @JsonProperty("ATTR_11")
    @Column(name = "ATTR_11")
    private String attr11;

    @JsonProperty("ATTR_12")
    @Column(name = "ATTR_12")
    private String attr12;

    @JsonProperty("ATTR_13")
    @Column(name = "ATTR_13")
    private String attr13;

    @JsonProperty("ATTR_14")
    @Column(name = "ATTR_14")
    private String attr14;

    @JsonProperty("ATTR_15")
    @Column(name = "ATTR_15")
    private String attr15;

    @JsonProperty("ATTR_16")
    @Column(name = "ATTR_16")
    private String attr16;

    @JsonProperty("ATTR_17")
    @Column(name = "ATTR_17")
    private String attr17;

    @JsonProperty("ATTR_18")
    @Column(name = "ATTR_18")
    private String attr18;

    @JsonProperty("ATTR_19")
    @Column(name = "ATTR_19")
    private String attr19;

    @JsonProperty("ATTR_20")
    @Column(name = "ATTR_20")
    private String attr20;

    @JsonProperty("ATTR_21")
    @Column(name = "ATTR_21")
    private String attr21;

    @JsonProperty("ATTR_22")
    @Column(name = "ATTR_22")
    private String attr22;

    @JsonProperty("ATTR_23")
    @Column(name = "ATTR_23")
    private String attr23;

    @JsonProperty("ATTR_24")
    @Column(name = "ATTR_24")
    private String attr24;

    @JsonProperty("ATTR_25")
    @Column(name = "ATTR_25")
    private String attr25;

    @JsonProperty("DEL_YN")
    @Column(name = "DEL_YN")
    private String delYn;

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

    @JsonProperty("GRADE_MODIFY_BY")
    @Column(name = "GRADE_MODIFY_BY")
    private String gradeModifyBy;

    @JsonProperty("GRADE_MODIFY_DTTM")
    @Column(name = "GRADE_MODIFY_DTTM")
    private LocalDateTime gradeModifyDttm;


}
