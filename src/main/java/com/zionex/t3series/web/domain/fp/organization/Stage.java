package com.zionex.t3series.web.domain.fp.organization;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;

import com.zionex.t3series.web.util.audit.BaseEntityFP;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_FP_STAGE")
public class Stage extends BaseEntityFP implements Serializable {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "STAGE_CD")
    private String stageCd;

    @Column(name = "STAGE_NM")
    private String stageNm;

    @Column(name = "DESC_TXT")
    private String descTxt;

    @ManyToOne
    @JoinColumn(name = "PLANT_CD", referencedColumnName = "PLANT_CD")
    private Plant plant;

    @Transient
    private String plantCode;

    @Transient
    private String plantName;

    public String getPlantCode() {
        return plant == null ? plantCode : plant.getPlantCd();
    }

    public String getPlantName() {
        return plant == null ? plantName : plant.getPlantNm();
    }

}
