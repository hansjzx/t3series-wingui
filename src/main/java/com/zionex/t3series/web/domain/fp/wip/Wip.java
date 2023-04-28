package com.zionex.t3series.web.domain.fp.wip;

import com.zionex.t3series.web.domain.fp.route.Route;
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
@Table(name = "TB_FP_WIP")
public class Wip extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "WIP_ID")
    private Long wipId;

    @Column(name = "WO_CD")
    private String woCd;

    @Column(name = "START_TS")
    private LocalDateTime startTs;

    @Column(name = "END_TS")
    private LocalDateTime endTs;

    @Column(name = "RELEASE_TS")
    private LocalDateTime releaseTs;

    @Column(name = "WIP_QTY")
    private Double wipQty;

    @Column(name = "REMAIN_QTY")
    private Double remainQty;

    @Column(name = "ATTR_GRP_CD")
    private String attrGrpCd;

    @Column(name = "TO_STOCK_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean toStockYn;

    @Column(name = "PROJECTION_INVENTORY_CD")
    private String projectionInventoryCd;

    @Column(name = "PROJECTION_WO_CD")
    private String projectionWoCd;

    @Column(name = "PROJECTION_WO_DUE_DT")
    private LocalDateTime projectionWoDueDt;

    @Column(name = "GRADE")
    private String grade;

    @ManyToOne
    @JoinColumn(name = "ROUTE_CD", referencedColumnName = "ROUTE_CD")
    private Route route;

    @Transient
    private String routeCode;

    @Transient
    private String routeName;

    @Transient
    private Double actualQty;

    @Transient
    private String resourceCd;

    @Transient
    private String batchGrpCd;

    public String getRouteCode() {
        return route == null ? routeCode : route.getRouteCd();
    }

    public String getRouteName() {
        return route == null ? routeName : route.getRouteNm();
    }

}
