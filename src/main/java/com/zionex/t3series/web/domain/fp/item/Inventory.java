package com.zionex.t3series.web.domain.fp.item;

import com.zionex.t3series.web.domain.fp.organization.Stage;
import com.zionex.t3series.web.util.audit.BaseEntityFP;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.io.Serializable;

@Data
@EqualsAndHashCode(callSuper = false)
@DynamicUpdate
@Entity
@Table(name = "TB_FP_INVENTORY")
public class Inventory extends BaseEntityFP implements Serializable {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "INVENTORY_CD")
    private String inventoryCd;

    @Column(name = "INVENTORY_NM")
    private String inventoryNm;

    @Column(name = "INVENTORY_GRP_CD")
    private String inventoryGrpCd;

    @Column(name = "ITEM_TP_CD")
    private String itemTpCd = "M";

    @Column(name = "INV_KEEPING_TM")
    private Double invKeepingTm;

    @Column(name = "INV_FENCE_TM")
    private Double invFenceTm;

    @Column(name = "TIME_UOM")
    private String timeUom;

    @Column(name = "STOCK_SPLIT_COMBINATION")
    private String stockSplitCombination;

    @Column(name = "ALT_ROUTE_POLICY")
    private String altRoutePolicy;

    @Column(name = "STOCK_SELECT_TP_CD")
    private String stockSelectTpCd = "SC";

    @ManyToOne
    @JoinColumn(name = "ITEM_CD", referencedColumnName = "ITEM_CD")
    private Item item;

    @Transient
    private String itemCode;

    @Transient
    private String itemName;

    @Transient
    private String itemClassCode;

    @Transient
    private String itemUom;

    @ManyToOne
    @JoinColumn(name = "STAGE_CD", referencedColumnName = "STAGE_CD")
    private Stage stage;

    @Transient
    private String plantCode;

    @Transient
    private String plantName;

    @Transient
    private String stageCode;

    @Transient
    private String stageName;

    public String getItemCode() {
        return item == null ? itemCode : item.getItemCd();
    }

    public String getItemName() {
        return item == null ? itemName : item.getItemNm();
    }

    public String getItemClassCode() {
        return item == null ? itemClassCode : item.getItemClassCd();
    }

    public String getItemUom() {
        return item == null ? itemUom : item.getItemUom();
    }

    public String getStageCode() {
        return stage == null ? stageCode : stage.getStageCd();
    }

    public String getStageName() {
        return stage == null ? stageName : stage.getStageNm();
    }

    public String getPlantCode() {
        return stage == null ? plantCode : stage.getPlantCode();
    }

    public String getPlantName() {
        return stage == null ? plantName : stage.getPlantName();
    }

    public String getItemCd() {
        return getItemCode();
    }

    public String getStageCd() {
        return getStageCode();
    }

}
