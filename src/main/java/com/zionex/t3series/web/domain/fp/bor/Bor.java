package com.zionex.t3series.web.domain.fp.bor;

import com.zionex.t3series.web.domain.fp.resource.Resource;
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
@Table(name = "TB_FP_BOR")
public class Bor extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "ALT_RESOURCE_PRIORITY")
    private Long altResourcePriority = 1L;

    @Column(name = "EFFICIENCY")
    private Double efficiency = 1d;

    @Column(name = "QUEUE_TM")
    private Double queueTm = 0d;

    @Column(name = "SETUP_TM")
    private Double setupTm = 0d;

    @Column(name = "PROCESS_TM")
    private Double processTm = 0d;

    @Column(name = "WAIT_TM")
    private Double waitTm = 0d;

    @Column(name = "MOVE_TM")
    private Double moveTm = 0d;

    @Column(name = "TRANSFER_BATCH_TM")
    private Double transferBatchTm = 0d;

    @Column(name = "STD_PROCESS_TM")
    private Double stdProcessTm = 0d;

    @Column(name = "TIME_UOM")
    private String timeUom;

    @Column(name = "PROCESS_TM_TP_CD")
    private String processTmTpCd = "N";

    @Column(name = "LOT_SIZE_MIN")
    private Double lotSizeMin = 0d;

    @Column(name = "LOT_SIZE_MAX")
    private Double lotSizeMax = 0d;

    @Column(name = "LOT_SIZE_MULTIPLR")
    private Double lotSizeMultiplr = 0d;

    @Column(name = "DIVIDE_TP_CD")
    private String divideTpCd;

    @Column(name = "DESC_TXT")
    private String descTxt;

    @ManyToOne
    @JoinColumn(name = "ROUTE_CD", referencedColumnName = "ROUTE_CD")
    private Route route;

    @Transient
    private String routeCode;

    @Transient
    private String routeName;

    @ManyToOne
    @JoinColumn(name = "RESOURCE_CD", referencedColumnName = "RESOURCE_CD")
    private Resource resource;

    @Transient
    private String resourceCode;

    @Transient
    private String resourceName;

    @Transient
    private String resourceDescTxt;

    @Transient
    private Boolean isMainResource;

    @Transient
    private String borSetMstDescTxt;

    @Transient
    private String borSetCd;

    public String getRouteCode() {
        return route == null ? routeCode : route.getRouteCd();
    }

    public String getRouteName() {
        return route == null ? routeName : route.getRouteNm();
    }

    public String getResourceCode() {
        return resource == null ? resourceCode : resource.getResourceCd();
    }

    public String getResourceName() {
        return resource == null ? resourceName : resource.getResourceNm();
    }

    public String getResourceDescTxt() {
        return resource == null ? resourceDescTxt : resource.getDescTxt();
    }

    public String getRouteCd() {
        return getRouteCode();
    }

    public String getResourceCd() {
        return getResourceCode();
    }

    public String getUniqueKey() {
        return getRouteCode() + "_" + getResourceCode();
    }

}
