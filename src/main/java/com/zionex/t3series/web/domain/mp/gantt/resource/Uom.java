package com.zionex.t3series.web.domain.mp.gantt.resource;

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
@Table(name = "TB_CM_UOM")
public class Uom {
    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @JsonProperty("ID")
    @Column(name = "ID")
    private String id;

    @JsonProperty("CONF_ID")
    @Column(name = "CONF_ID")
    private String confId;

    @JsonProperty("UOM_CD")
    @Column(name = "UOM_CD")
    private String uomCd;

    @JsonProperty("UOM_NM")
    @Column(name = "UOM_NM")
    private String uomNm;

    @JsonProperty("BASE_PLAN_UOM_YN")
    @Column(name = "BASE_PLAN_UOM_YN")
    private String basePlanUomYn;

    @JsonProperty("BASE_WEIGHT_UOM_YN")
    @Column(name = "BASE_WEIGHT_UOM_YN")
    private String baseWeightUomYn;

    @JsonProperty("ACTV_YN")
    @Column(name = "ACTV_YN")
    private String actvYn;

    @JsonProperty("CREATE_BY")
    @Column(name = "CREATE_BY")
    private String createBy;

    @JsonProperty("CREATE_DTTM")
    @Column(name = "CREATE_DTTM")
    private String createDttm;

    @JsonProperty("MODIFY_BY")
    @Column(name = "MODIFY_BY")
    private String modifyBy;

    @JsonProperty("MODIFY_DTTM")
    @Column(name = "MODIFY_DTTM")
    private String modifyDttm;

    @JsonProperty("TIME_UOM_YN")
    @Column(name = "TIME_UOM_YN")
    private String timeUomYn;

    @JsonProperty("TIME_BUCKET_YN")
    @Column(name = "TIME_BUCKET_YN")
    private String timeBucketYn;

    @JsonProperty("ACTUAL_REF_YN")
    @Column(name = "ACTUAL_REF_YN")
    private String actualRefYn;

}
