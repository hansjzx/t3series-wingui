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
@Table(name = "TB_FP_BOR_SET_DTL")
public class BorSetDtl extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "RESOURCE_TP_CD")
    private String resourceTpCd = "M";

    @Column(name = "DESC_TXT")
    private String descTxt;

    @ManyToOne
    @JoinColumn(name = "RESOURCE_CD", referencedColumnName = "RESOURCE_CD")
    private Resource resource;

    @Transient
    private String resourceCode;

    @Transient
    private String resourceName;

    @ManyToOne
    @JoinColumn(name = "BOR_SET_CD", referencedColumnName = "BOR_SET_CD")
    private BorSetMst borSetMst;

    @Transient
    private String borSetCode;

    @Transient
    private String borSetMstDescTxt;

    @ManyToOne
    @JoinColumn(name = "ROUTE_CD", referencedColumnName = "ROUTE_CD")
    private Route route;

    @Transient
    private String routeCode;

    @Transient
    private String routeName;


    public String getResourceCode() {
        return resource == null ? resourceCode : resource.getResourceCd();
    }

    public String getResourceName() {
        return resource == null ? resourceName : resource.getResourceNm();
    }

    public String getBorSetCode() {
        return borSetMst == null ? borSetCode : borSetMst.getBorSetCd();
    }

    public String getBorSetMstDescTxt() {
        return borSetMst == null ? borSetMstDescTxt : borSetMst.getDescTxt();
    }

    public String getRouteCode() {
        return route == null ? routeCode : route.getRouteCd();
    }

    public String getRouteName() {
        return route == null ? routeName : route.getRouteNm();
    }

    public String getBorSetCd() {
        return getBorSetCode();
    }

    public String getResourceCd() {
        return getResourceCode();
    }

    public String getRouteCd() {
        return getRouteCode();
    }

    public String getUniqueKey() {
        return getBorSetCd() + "_" + getRouteCd() + "_" + getResourceCode();
    }

}
