package com.zionex.t3series.web.domain.fp.item;

import com.zionex.t3series.web.util.audit.BaseEntityFP;
import com.zionex.t3series.web.util.converter.ColorConverter;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = false)
@DynamicUpdate
@Entity
@Table(name = "TB_FP_ITEM")
public class Item extends BaseEntityFP implements Serializable {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "ITEM_CD", unique = true)
    private String itemCd;

    @Column(name = "ITEM_NM")
    private String itemNm;

    @Column(name = "ITEM_CLASS_CD")
    private String itemClassCd;

    @Column(name = "ITEM_UOM")
    private String itemUom;

    @Column(name = "PRIORITY")
    private Long priority;

    @Column(name = "DISPLAY_COLOR")
    @Convert(converter = ColorConverter.class)
    private String displayColor;

    @Column(name = "WO_SIZE_MIN")
    private Double woSizeMin;

    @Column(name = "WO_SIZE_MAX")
    private Double woSizeMax;

    @Column(name = "WO_SIZE_MULTIPLR")
    private Double woSieMultiplr;

    @Column(name = "SOL")
    private LocalDate sol;

    @Column(name = "EOL")
    private LocalDate eol;

    @Column(name = "DISPLAY_SEQ")
    private Integer displaySeq;

    @Column(name = "PRODTN_LIMIT_CD")
    private String prodtnLimitCd;

    @Column(name = "DESC_TXT")
    private String descTxt;

    @ManyToOne
    @JoinColumn(name = "ITEM_GRP_CD", referencedColumnName = "ITEM_GRP_CD")
    private ItemGrp itemGrp;

    @Transient
    private String itemGroupCode;

    @Transient
    private String itemGroupName;

    public String getItemGroupCode() {
        return itemGrp == null ? itemGroupCode : itemGrp.getItemGrpCd();
    }

    public String getItemGroupName() {
        return itemGrp == null ? itemGroupName : itemGrp.getItemGrpNm();
    }

    public String getItemGrpCd() {
        return getItemGroupCode();
    }

}
