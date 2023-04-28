package com.zionex.t3series.web.domain.fp.order;

import com.zionex.t3series.web.domain.fp.item.Inventory;
import com.zionex.t3series.web.util.audit.BaseEntityFP;
import com.zionex.t3series.web.util.converter.BooleanToYNConverter;
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
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@DynamicUpdate
@Entity
@Table(name = "TB_FP_WORK_ORDER")
public class WorkOrder extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "WO_CD")
    private String woCd;

    @Column(name = "GRP_PRIORITY")
    private Long grpPriority;

    @Column(name = "REQUEST_QTY")
    private Double requestQty;

    @Column(name = "DUE_DT")
    private LocalDateTime dueDt;

    @Column(name = "DUE_DT_FENCE")
    private LocalDateTime dueDtFence;

    @Column(name = "PST")
    private LocalDateTime pst;

    @Column(name = "PRIORITY")
    private Long priority;

    @Column(name = "EFFICIENCY")
    private Double efficiency;

    @Column(name = "DISPLAY_COLOR")
    @Convert(converter = ColorConverter.class)
    private String displayColor;

    @Column(name = "ACTIVE_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean activeYn;

    @Column(name = "TO_STOCK_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean toStockYn;

    @Column(name = "DELIVERY_POLICY")
    private String deliveryPolicy;

    @Column(name = "ORDER_STRATEGY_TP_CD")
    private String orderStrategyTpCd;

    @Column(name = "ATTR_GRP_CD")
    private String attrGrpCd;

    @Column(name = "NECK_POLICY")
    private String neckPolicy;

    @Column(name = "NECK_CNT")
    private Long neckCnt = -1L;

    @Column(name = "NECK_PERIOD")
    private Long neckPeriod;

    @Column(name = "TIME_UOM")
    private String timeUom;

    @Column(name = "GRADE")
    private String grade;

    @Column(name = "GRADE_OPERATOR_CD")
    private String gradeOperatorCd;

    @Column(name = "ORDER_TP_CD")
    private String orderTpCd;

    @Column(name = "CANC_ON_LATE_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean cancOnLateYn;

    @Column(name = "CANC_ON_SHTG_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean cancOnShtgYn;

    @Column(name = "DESC_TXT")
    private String descTxt;

    @ManyToOne
    @JoinColumn(name = "SO_CD", referencedColumnName = "SO_CD")
    private SalesOrder salesOrder;

    @Transient
    private String soCode;

    @Transient
    private String customerCode;

    @Transient
    private String customerName;

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

    public String getInventoryCd() {
        return getInventoryCode();
    }

    public String getSoCode() {
        return salesOrder == null ? soCode : salesOrder.getSoCd();
    }

    public String getCustomerCode() {
        return salesOrder == null ? customerCode : salesOrder.getCustomerCode();
    }

    public String getCustomerName() {
        return salesOrder == null ? customerName : salesOrder.getCustomerName();
    }

    public String getSoCd() {
        return getSoCode();
    }

}
