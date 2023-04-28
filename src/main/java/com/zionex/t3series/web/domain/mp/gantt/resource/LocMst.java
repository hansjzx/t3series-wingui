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
@Table(name = "TB_CM_LOC_MST")
public class LocMst {
    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @JsonProperty("ID")
    @Column(name = "ID")
    private String id;

    @JsonProperty("CONF_ID")
    @Column(name = "CONF_ID")
    private String confId;

    @JsonProperty("CORPOR_ID")
    @Column(name = "CORPOR_ID")
    private String corporId;

    @JsonProperty("LOCAT_TP_ID")
    @Column(name = "LOCAT_TP_ID")
    private String locatTpId;

    @JsonProperty("LOCAT_LV")
    @Column(name = "LOCAT_LV")
    private Double locatLv;

    @JsonProperty("LOCAT_LV_DESCRIP")
    @Column(name = "LOCAT_LV_DESCRIP")
    private String locatLvDescrip;

    @JsonProperty("DMND_INTG_YN")
    @Column(name = "DMND_INTG_YN")
    private String dmndIntgYn;

    @JsonProperty("INV_POLICY_TARGET_YN")
    @Column(name = "INV_POLICY_TARGET_YN")
    private String invPolicyTargetYn;

    @JsonProperty("ACTV_YN")
    @Column(name = "ACTV_YN")
    private String actvYn;

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
    
}
