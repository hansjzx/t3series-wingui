package com.zionex.t3series.web.domain.fp.stock;

import com.zionex.t3series.web.domain.fp.item.Inventory;
import com.zionex.t3series.web.util.audit.BaseEntityFP;
import com.zionex.t3series.web.util.converter.BooleanToYNConverter;
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
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@DynamicUpdate
@Entity
@Table(name = "TB_FP_STOCK")
public class Stock extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "STOCK_CD")
    private String stockCd;

    @Column(name = "RECEIPT_TS")
    private LocalDateTime receiptTs;

    @Column(name = "USABLE_TS")
    private LocalDateTime usableTs;

    @Column(name = "EXPIRE_TS")
    private LocalDateTime expireTs;

    @Column(name = "QTY")
    private Double qty;

    @Column(name = "PRIORITY")
    private Long priority;

    @Column(name = "PROJECTION_INVENTORY_CD")
    private String projectionInventoryCd;

    @Column(name = "PROJECTION_WO_CD")
    private String projectionWoCd;

    @Column(name = "PROJECTION_WO_DUE_DT")
    private LocalDateTime projectionWoDueDt;

    @Column(name = "INFINITE_TP_CD")
    private String infiniteTpCd;

    @Column(name = "ATTR_GRP_CD")
    private String attrGrpCd;

    @Column(name = "GRADE")
    private String grade;

    @Column(name = "ACTIVE_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean activeYn;

    @Column(name = "DESC_TXT")
    private String descTxt;

    @ManyToOne
    @JoinColumn(name = "INVENTORY_CD", referencedColumnName = "INVENTORY_CD")
    private Inventory inventory;

    @Transient
    private String inventoryCode;

    @Transient
    private String inventoryName;

    @Transient
    private String itemCode;

    @Transient
    private String itemName;

    @Transient
    private String itemClassCode;

    @Transient
    private String orderPeggingCd;

    public String getInventoryCode() {
        return inventory == null ? inventoryCode : inventory.getInventoryCd();
    }

    public String getInventoryName() {
        return inventory == null ? inventoryName : inventory.getInventoryNm();
    }

    public String getItemCode() {
        return inventory == null ? itemCode : inventory.getItemCode();
    }

    public String getItemName() {
        return inventory == null ? itemName : inventory.getItemName();
    }

    public String getItemClassCode() {
        return inventory == null ? itemClassCode : inventory.getItemClassCode();
    }

}
