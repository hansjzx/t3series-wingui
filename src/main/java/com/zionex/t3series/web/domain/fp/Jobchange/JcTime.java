package com.zionex.t3series.web.domain.fp.Jobchange;

import com.zionex.t3series.web.domain.fp.resource.Resource;
import com.zionex.t3series.web.domain.fp.route.Route;
import com.zionex.t3series.web.util.audit.BaseEntityFP;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

@Getter
@Setter
@Entity
@Table(name = "TB_FP_JC_TIME")
public class JcTime extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "PREV_JC_TM")
    private Double prevJcTm = 0d;

    @Column(name = "NEXT_JC_TM")
    private Double nextJcTm = 0d;

    @Column(name = "JC_DIVIDE_TP_CD")
    private String jcDivideTpCd = "Y";

    @Column(name = "TIME_UOM")
    private String timeUom;

    @ManyToOne
    @JoinColumn(name = "RESOURCE_CD", referencedColumnName = "RESOURCE_CD")
    private Resource resource;

    @Transient
    private String resourceCode;

    @Transient
    private String resourceName;

    @ManyToOne
    @JoinColumn(name = "PREV_ROUTE_CD", referencedColumnName = "ROUTE_CD")
    private Route prevRoute;

    @Transient
    private String prevRouteCode;

    @Transient
    private String prevRouteName;

    @ManyToOne
    @JoinColumn(name = "NEXT_ROUTE_CD", referencedColumnName = "ROUTE_CD")
    private Route nextRoute;

    @Transient
    private String nextRouteCode;

    @Transient
    private String nextRouteName;

    public String getResourceCode() {
        return resource == null ? resourceCode : resource.getResourceCd();
    }

    public String getResourceName() {
        return resource == null ? resourceName : resource.getResourceNm();
    }

    public String getResourceCd() {
        return getResourceCode();
    }

    public String getPrevRouteCode() {
        return prevRoute == null ? prevRouteCode : prevRoute.getRouteCd();
    }

    public String getPrevRouteName() {
        return prevRoute == null ? prevRouteName : prevRoute.getRouteNm();
    }

    public String getPrevRouteCd() {
        return getPrevRouteCode();
    }

    public String getNextRouteCode() {
        return nextRoute == null ? nextRouteCode : nextRoute.getRouteCd();
    }

    public String getNextRouteName() {
        return nextRoute == null ? nextRouteName : nextRoute.getRouteNm();
    }

    public String getNextRouteCd() {
        return getNextRouteCode();
    }

    public String getUniqueKey() {
        return getResourceCode() + "_" + getPrevRouteCode() + "_" + getNextRouteCode();
    }

}
