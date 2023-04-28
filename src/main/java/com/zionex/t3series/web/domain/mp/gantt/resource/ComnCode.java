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
@Table(name = "TB_AD_COMN_CODE")
public class ComnCode {
    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @JsonProperty("ID")
    @Column(name = "ID")
    private String id;
    
    @JsonProperty("SRC_ID")
    @Column(name = "SRC_ID")
    private String srcId;
    
    @JsonProperty("COMN_CD")
    @Column(name = "COMN_CD")
    private String comnCd;
    
    @JsonProperty("COMN_CD_NM")
    @Column(name = "COMN_CD_NM")
    private String comnCdNm;
    
    @JsonProperty("SEQ")
    @Column(name = "SEQ")
    private Double seq;
    
    @JsonProperty("DESCRIP")
    @Column(name = "DESCRIP")
    private String descrip;
    
    @JsonProperty("DEFAT_VAL_YN")
    @Column(name = "DEFAT_VAL_YN")
    private String defatValYn;
    
    @JsonProperty("IF_VAL")
    @Column(name = "IF_VAL")
    private String ifVal;
    
    @JsonProperty("USE_YN")
    @Column(name = "USE_YN")
    private String useYn;
    
    @JsonProperty("DEL_YN")
    @Column(name = "DEL_YN")
    private String delYn;
    
    @JsonProperty("ATTR_01_VAL")
    @Column(name = "ATTR_01_VAL")
    private String attr01Val;
    
    @JsonProperty("ATTR_02_VAL")
    @Column(name = "ATTR_02_VAL")
    private String attr02Val;
    
    @JsonProperty("ATTR_03_VAL")
    @Column(name = "ATTR_03_VAL")
    private String attr03Val;
    
    @JsonProperty("ATTR_04_VAL")
    @Column(name = "ATTR_04_VAL")
    private String attr04Val;
    
    @JsonProperty("ATTR_05_VAL")
    @Column(name = "ATTR_05_VAL")
    private String attr05Val;
    
    @JsonProperty("ATTR_06_VAL")
    @Column(name = "ATTR_06_VAL")
    private String attr06Val;
    
    @JsonProperty("ATTR_07_VAL")
    @Column(name = "ATTR_07_VAL")
    private String attr07Val;
    
    @JsonProperty("ATTR_08_VAL")
    @Column(name = "ATTR_08_VAL")
    private String attr08Val;
    
    @JsonProperty("ATTR_09_VAL")
    @Column(name = "ATTR_09_VAL")
    private String attr09Val;
    
    @JsonProperty("ATTR_10_VAL")
    @Column(name = "ATTR_10_VAL")
    private String attr10Val;
    
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
