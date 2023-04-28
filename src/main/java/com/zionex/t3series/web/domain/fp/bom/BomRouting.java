package com.zionex.t3series.web.domain.fp.bom;

import com.zionex.t3series.web.domain.fp.item.Inventory;
import com.zionex.t3series.web.domain.fp.route.Route;
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

@Data
@EqualsAndHashCode(callSuper = false)
@DynamicUpdate
@Entity
@Table(name = "TB_FP_BOM_ROUTING")
public class BomRouting extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "BOM_TP_CD")
    private String bomTpCd = "C";

    @Column(name = "BOM_RATE")
    private Double bomRate = 1d;

    @Column(name = "PRIORITY")
    private Long priority = 1L;

    @Column(name = "INPUT_TP_CD")
    private String inputTpCd = "R";

    @Column(name = "ALT_VAL")
    private Double altVal = 0d;

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
    private String itemUom;

    @ManyToOne
    @JoinColumn(name = "ROUTE_CD", referencedColumnName = "ROUTE_CD")
    private Route route;

    @Transient
    private String routeCode;

    @Transient
    private String routeName;

    @Transient
    private String routeDescTxt;

    @Transient
    private int level;

    @Transient
    private double productRate;

    @Transient
    private String icon;

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

    public String getItemUom() {
        return inventory == null ? itemUom : inventory.getItemUom();
    }

    public String getRouteCode() {
        return route == null ? routeCode : route.getRouteCd();
    }

    public String getRouteName() {
        return route == null ? routeName : route.getRouteNm();
    }

    public String getRouteDescTxt() {
        return route == null ? routeDescTxt : route.getDescTxt();
    }

    public String getInventoryCd() {
        return getInventoryCode();
    }

    public String getRouteCd() {
        return getRouteCode();
    }

}
