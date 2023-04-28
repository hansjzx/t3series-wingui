package com.zionex.t3series.web.domain.fp.organization;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.zionex.t3series.web.util.audit.BaseEntityFP;

import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_FP_PLANT")
public class Plant extends BaseEntityFP implements Serializable {

    private static final long serialVersionUID = -5369105315165561896L;

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "PLANT_CD")
    private String plantCd;

    @Column(name = "PLANT_NM")
    private String plantNm;

    @Column(name = "SITE_CD")
    private String siteCd;

    @Column(name = "DESC_TXT")
    private String descripText;

}
