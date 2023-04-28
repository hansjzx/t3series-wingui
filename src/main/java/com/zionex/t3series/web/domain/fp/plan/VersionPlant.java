package com.zionex.t3series.web.domain.fp.plan;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.zionex.t3series.web.domain.fp.organization.Plant;
import com.zionex.t3series.web.util.audit.BaseEntityFP;

import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_FP_VERSION_PLANT")
public class VersionPlant extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "VERSION_CD")
    private String versionCd;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PLANT_CD", referencedColumnName = "PLANT_CD")
    private Plant plant;

}
