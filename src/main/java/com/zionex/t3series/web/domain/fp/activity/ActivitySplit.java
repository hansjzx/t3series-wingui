package com.zionex.t3series.web.domain.fp.activity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.zionex.t3series.web.util.audit.BaseEntityFP;
import com.zionex.t3series.web.util.converter.BooleanToYNConverter;

import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_FP_ACTIVITY_SPLIT")
public class ActivitySplit extends BaseEntityFP {

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

    @Column(name = "ACTIVITY_ID")
    private Long activityId;

    @Column(name = "SPLIT_SEQ")
    private Long splitSeq;

    @Column(name = "WO_CD")
    private String woCd;

    @Column(name = "ITEM_CD")
    private String itemCd;

    @Column(name = "RESOURCE_CD")
    private String resourceCd;

    @Column(name = "ROUTE_CD")
    private String routeCd;

    @Column(name = "QTY")
    private Double qty;

    @Column(name = "START_TS")
    private LocalDateTime startTs;

    @Column(name = "END_TS")
    private LocalDateTime endTs;

    @Column(name = "WIP_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean wipYn;

    @Column(name = "CFM_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean confirmYn;

}
