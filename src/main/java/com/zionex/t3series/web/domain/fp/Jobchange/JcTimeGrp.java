package com.zionex.t3series.web.domain.fp.Jobchange;

import com.zionex.t3series.web.domain.fp.resource.Resource;
import com.zionex.t3series.web.domain.fp.route.RouteGrp;
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
@Table(name = "TB_FP_JC_TIME_GRP")
public class JcTimeGrp extends BaseEntityFP implements Serializable {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "PREV_JC_TM")
    private Long prevJcTm = 0L;

    @Column(name = "NEXT_JC_TM")
    private Long nextJcTm = 0L;

    @Column(name = "TIME_UOM")
    private String timeUom;

    @Column(name = "JC_DIVIDE_TP_CD")
    private String jcDivideTpCd = "Y";

    @ManyToOne
    @JoinColumn(name = "RESOURCE_CD", referencedColumnName = "RESOURCE_CD")
    private Resource resource;

    @Transient
    private String resourceCode;

    @Transient
    private String resourceName;

    @ManyToOne
    @JoinColumn(name = "PREV_ROUTE_GRP_CD", referencedColumnName = "ROUTE_GRP_CD")
    private RouteGrp prevRouteGrp;

    @Transient
    private String prevRouteGrpCode;

    @Transient
    private String prevRouteGrpName;

    @ManyToOne
    @JoinColumn(name = "NEXT_ROUTE_GRP_CD", referencedColumnName = "ROUTE_GRP_CD")
    private RouteGrp nextRouteGrp;

    @Transient
    private String nextRouteGrpCode;

    @Transient
    private String nextRouteGrpName;


    public String getResourceCode() {
        return resource == null ? resourceCode : resource.getResourceCd();
    }

    public String getResourceName() {
        return resource == null ? resourceName : resource.getResourceNm();
    }

    public String getResourceCd() {
        return getResourceCode();
    }

    public String getPrevRouteGrpCode() {
        return prevRouteGrp == null ? prevRouteGrpCode : prevRouteGrp.getRouteGrpCd();
    }

    public String getPrevRouteGrpName() {
        return prevRouteGrp == null ? prevRouteGrpName : prevRouteGrp.getRouteGrpNm();
    }

    public String getPrevRouteGrpCd() {
        return getPrevRouteGrpCode();
    }

    public String getNextRouteGrpCode() {
        return nextRouteGrp == null ? nextRouteGrpCode : nextRouteGrp.getRouteGrpCd();
    }

    public String getNextRouteGrpName() {
        return nextRouteGrp == null ? nextRouteGrpName : nextRouteGrp.getRouteGrpNm();
    }

    public String getNextRouteGrpCd() {
        return getNextRouteGrpCode();
    }

    public String getUniqueKey() {
        return getResourceCode() + "_" + getPrevRouteGrpCode() + "_" + getNextRouteGrpCode();
    }

}
