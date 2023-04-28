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
@Table(name = "TB_CM_LOC_DTL")
public class LocDtl {
    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @JsonProperty("ID")
    @Column(name = "ID")
    private String id;
    
    @JsonProperty("LOCAT_MST_ID")
    @Column(name = "LOCAT_MST_ID")
    private String locatMstId;
    
    @JsonProperty("LOCAT_CD")
    @Column(name = "LOCAT_CD")
    private String locatCd;
    
    @JsonProperty("LOCAT_NM")
    @Column(name = "LOCAT_NM")
    private String locatNm;
    
    @JsonProperty("LOCAT_GRP_ID")
    @Column(name = "LOCAT_GRP_ID")
    private String locatGrpId;
    
    @JsonProperty("BUSINESS_UNIT")
    @Column(name = "BUSINESS_UNIT")
    private String businessUnit;
    
    @JsonProperty("IN_OUT_FLAG_ID")
    @Column(name = "IN_OUT_FLAG_ID")
    private String inOutFlagId;
    
    @JsonProperty("DISPLAY_COLOR")
    @Column(name = "DISPLAY_COLOR")
    private String displayColor;
    
    @JsonProperty("ACTV_YN")
    @Column(name = "ACTV_YN")
    private String actvYn;
    
    @JsonProperty("MODIFY_DTTM")
    @Column(name = "MODIFY_DTTM")
    private LocalDateTime modifyDttm;
    
    @JsonProperty("MODIFY_BY")
    @Column(name = "MODIFY_BY")
    private String modifyBy;
    
    @JsonProperty("CREATE_BY")
    @Column(name = "CREATE_BY")
    private String createBy;
    
    @JsonProperty("CREATE_DTTM")
    @Column(name = "CREATE_DTTM")
    private LocalDateTime createDttm;
    
}
