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
@Table(name = "TB_CM_HORIZON_TIME_BUCKET")
public class HorizonTimeBucket {
    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @JsonProperty("ID")
    @Column(name = "ID")
    private String id;

    @JsonProperty("CONF_ID")
    @Column(name = "CONF_ID")
    private String confId;

    @JsonProperty("TIME_UOM_ID")
    @Column(name = "TIME_UOM_ID")
    private String timeUomId;

    @JsonProperty("STRT_DATE")
    @Column(name = "STRT_DATE")
    private String strtDate;

    @JsonProperty("END_DATE")
    @Column(name = "END_DATE")
    private String endDate;

    @JsonProperty("DURA")
    @Column(name = "DURA")
    private Double dura = 0d;

    @JsonProperty("DESCRIP")
    @Column(name = "DESCRIP")
    private String descrip;

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

    @JsonProperty("ACTV_YN")
    @Column(name = "ACTV_YN")
    private String actvYn;

    @JsonProperty("STRT_DATE_TP_ID")
    @Column(name = "STRT_DATE_TP_ID")
    private String strtDateTpId;

    @JsonProperty("DAY_OF_WEEK_ID")
    @Column(name = "DAY_OF_WEEK_ID")
    private String dayOfWeekId;

    @JsonProperty("BUCKET_TP_VAL")
    @Column(name = "BUCKET_TP_VAL")
    private String bucketTpVal;

    @JsonProperty("VAR_TIME_UOM_ID")
    @Column(name = "VAR_TIME_UOM_ID")
    private String varTimeUomId;

    @JsonProperty("DURA2")
    @Column(name = "DURA2")
    private Double dura2 = 0d;

    @JsonProperty("STRT_DATE2")
    @Column(name = "STRT_DATE2")
    private String strtDate2;

    @JsonProperty("STRT_TIME")
    @Column(name = "STRT_TIME")
    private String strtTime;

    @JsonProperty("PLAN_SNRIO_MGMT_MST_ID")
    @Column(name = "PLAN_SNRIO_MGMT_MST_ID")
    private String planSnrioMgmtMstId;

}
