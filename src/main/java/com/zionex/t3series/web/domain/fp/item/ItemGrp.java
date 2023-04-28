package com.zionex.t3series.web.domain.fp.item;

import com.zionex.t3series.web.util.audit.BaseEntityFP;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Data
@EqualsAndHashCode(callSuper = false)
@DynamicUpdate
@Entity
@Table(name = "TB_FP_ITEM_GRP")
public class ItemGrp extends BaseEntityFP implements Serializable {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "ITEM_GRP_CD", unique = true)
    private String itemGrpCd;

    @Column(name = "ITEM_GRP_NM")
    private String itemGrpNm;

    @Column(name = "PRODTN_LIMIT_CD")
    private String prodtnLimitCd;

    @Column(name = "DESC_TXT")
    private String descTxt;

}
