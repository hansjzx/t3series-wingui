package com.zionex.t3series.web.domain.fp.route;

import com.zionex.t3series.web.util.audit.BaseEntityFP;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Data
@EqualsAndHashCode(callSuper = false)
@DynamicUpdate
@Entity
@Table(name = "TB_FP_ROUTE_GRP")
public class RouteGrp extends BaseEntityFP implements Serializable {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "ROUTE_GRP_CD", unique = true)
    private String routeGrpCd;

    @Column(name = "ROUTE_GRP_NM")
    private String routeGrpNm;

    @Column(name = "DESC_TXT")
    private String descTxt;
}
