package com.zionex.t3series.web.domain.bf.abcanalysis;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.zionex.t3series.web.util.audit.BaseEntity;

import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_BF_ITEM_ACCOUNT_MODEL_MAP")
public class ABCAnalysis extends BaseEntity {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "SALES_LV_CD")
    private String salesLvCd;

    @Column(name = "ACCOUNT_CD")
    private String accountCd;

    @Column(name = "ITEM_LV_CD")
    private String itemLvCd;

    @Column(name = "ITEM_CD")
    private String itemCd;

    @Column(name = "CREATE_BY")
    private String createBy;

    @Column(name = "CREATE_DTTM")
    private LocalDateTime createDttm;
    
    @Column(name = "ACTV_YN")
    private String activeYN;
}