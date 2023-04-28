package com.zionex.t3series.web.domain.fp.organization;

import com.zionex.t3series.web.util.audit.BaseEntityFP;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_FP_CORPORATION")
public class Corporation extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "CORPORATION_CD")
    private String corporationCd;

    @Column(name = "CORPORATION_NM")
    private String corporationNm;

    @Column(name = "DESC_TXT")
    private String descTxt;

}
