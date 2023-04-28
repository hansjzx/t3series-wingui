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
@Table(name = "TB_CM_CONBD_MAIN_VER_MST")
public class ConbdMainVerMst {
    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @JsonProperty("ID")
    @Column(name = "ID")
    private String id;

    @JsonProperty("MODULE_ID")
    @Column(name = "MODULE_ID")
    private String moduleId;

    @JsonProperty("MAIN_VER_ID")
    @Column(name = "MAIN_VER_ID")
    private String mainVerId;

    @JsonProperty("VER_DATE")
    @Column(name = "VER_DATE")
    private String verDate;

    @JsonProperty("DESCRIP")
    @Column(name = "DESCRIP")
    private String descrip;

    @JsonProperty("PLAN_HORIZ_STRT")
    @Column(name = "PLAN_HORIZ_STRT")
    private String planHorizStrt;

    @JsonProperty("PLAN_HORIZ_END")
    @Column(name = "PLAN_HORIZ_END")
    private String planHorizEnd;

    @JsonProperty("TIME_BUKT")
    @Column(name = "TIME_BUKT")
    private String timeBukt;

    @JsonProperty("DMND_VER_ID")
    @Column(name = "DMND_VER_ID")
    private String dmndVerId;

    @JsonProperty("SRP_CONBD_VER_MST_ID")
    @Column(name = "SRP_CONBD_VER_MST_ID")
    private String srpConbdVerMstId;

    @JsonProperty("PLAN_SNRIO_MGMT_MST_ID")
    @Column(name = "PLAN_SNRIO_MGMT_MST_ID")
    private String planSnrioMgmtMstId;

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

}
