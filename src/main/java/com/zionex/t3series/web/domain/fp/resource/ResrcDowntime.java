package com.zionex.t3series.web.domain.fp.resource;

import com.zionex.t3series.web.util.audit.BaseEntityFP;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_FP_RESRC_DOWNTIME")
public class ResrcDowntime extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "VERSION_CD")
    private String versionCd;

    @Column(name = "PLANT_CD")
    private String plantCd;

    @Column(name = "STAGE_CD")
    private String stageCd;

    @Column(name = "RESOURCE_CD")
    private String resourceCd;

    @Column(name = "VIRTUAL_RESOURCE_SEQ")
    private Long virtualResourceSeq;

    @Column(name = "START_TS")
    private LocalDateTime startTs;

    @Column(name = "END_TS")
    private LocalDateTime endTs;

    @Column(name = "DISPLAY_COLOR")
    private String displayColor;

    @Column(name = "DESC_TXT")
    private String descTxt;

}
