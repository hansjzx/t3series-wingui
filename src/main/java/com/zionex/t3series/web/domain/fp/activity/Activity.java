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
@Table(name = "TB_FP_ACTIVITY")
public class Activity extends BaseEntityFP {

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

    @Column(name = "WO_CD")
    private String woCd;

    @Column(name = "ITEM_CD")
    private String itemCd;

    @Column(name = "ITEM_NM")
    private String itemNm;

    @Column(name = "ITEM_UOM")
    private String itemUom;

    @Column(name = "DISPLAY_COLOR")
    private String displayColor;

    @Column(name = "RESOURCE_CD")
    private String resourceCd;

    @Column(name = "RESOURCE_TP_CD")
    private String resourceTpCd;

    @Column(name = "VIRTUAL_RESOURCE_SEQ")
    private Long virtualResourceSeq;

    @Column(name = "ROUTE_CD")
    private String routeCd;

    @Column(name = "ROUTE_NM")
    private String routeNm;

    @Column(name = "QTY")
    private Double qty;

    @Column(name = "START_TS")
    private LocalDateTime startTs;

    @Column(name = "END_TS")
    private LocalDateTime endTs;

    @Column(name = "COMPLETED_TS")
    private LocalDateTime completedTs;

    @Column(name = "QUEUE_TM")
    private Double queueTm;

    @Column(name = "SETUP_TM")
    private Double setupTm;

    @Column(name = "PROCESS_TM")
    private Double processTm;

    @Column(name = "WAIT_TM")
    private Double waitTm;

    @Column(name = "MOVE_TM")
    private Double moveTm;

    @Column(name = "PREV_JC_TM")
    private Double prevJcTm;

    @Column(name = "PREV_JC_START_TS")
    private LocalDateTime prevJcStartTs;

    @Column(name = "PREV_JC_END_TS")
    private LocalDateTime prevJcEndTs;

    @Column(name = "PREV_JC_DIVIDE_TP_CD")
    private String prevJcDivideTpCd;

    @Column(name = "NEXT_JC_TM")
    private Double nextJcTm;

    @Column(name = "NEXT_JC_START_TS")
    private LocalDateTime nextJcStartTs;

    @Column(name = "NEXT_JC_END_TS")
    private LocalDateTime nextJcEndTs;

    @Column(name = "NEXT_JC_DIVIDE_TP_CD")
    private String nextJcDivideTpCd;

    @Column(name = "TIME_UOM")
    private String timeUom;

    @Column(name = "WIP_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean wipYn;

    @Column(name = "CFM_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean cfmYn;

    @Column(name = "DIVIDE_TP_CD")
    private String divideTpCd;

}
