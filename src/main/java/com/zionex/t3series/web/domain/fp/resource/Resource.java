package com.zionex.t3series.web.domain.fp.resource;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.zionex.t3series.web.domain.fp.organization.Stage;
import com.zionex.t3series.web.util.audit.BaseEntityFP;
import com.zionex.t3series.web.util.converter.BooleanToYNConverter;

import com.zionex.t3series.web.util.converter.ColorConverter;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

@Data
@EqualsAndHashCode(callSuper = false)
@DynamicUpdate
@Entity
@Table(name = "TB_FP_RESOURCE")
public class Resource extends BaseEntityFP implements Serializable {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "RESOURCE_CD")
    private String resourceCd;

    @Column(name = "RESOURCE_NM")
    private String resourceNm;

    @Column(name = "CALENDAR_CD")
    private String calendarCd;

    @Column(name = "DISPLAY_COLOR")
    @Convert(converter = ColorConverter.class)
    private String displayColor;

    @Column(name = "DISPLAY_SEQ")
    private Long displaySeq;

    @Column(name = "LOAD_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean loadYn;

    @Column(name = "TOOL_RESOURCE_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean toolResourceYn;

    @Column(name = "TOOL_CNT")
    private Long toolCnt;

    @Column(name = "FIFO_TP_CD")
    private String fifoTpCd;

    @Column(name = "JC_TM")
    private Long jcTm;

    @Column(name = "ROUTE_JC_TM")
    private Long routeJcTm;

    @Column(name = "ROUTE_GRP_JC_TM")
    private Long routeGrpJcTm;

    @Column(name = "JC_DIVIDE_TP_CD")
    private String jcDivideTpCd;

    @Column(name = "TIME_UOM")
    private String timeUom;

    @Column(name = "VIRTUAL_RESOURCE_CNT")
    private Long virtualResourceCnt;

    @Column(name = "BATCH_RESOURCE_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean batchResourceYn;

    @Column(name = "PLAN_LVL_TP_CD")
    private String planLvlTpCd;

    @Column(name = "DESC_TXT")
    private String descTxt;
    

    @ManyToOne
    @JoinColumn(name = "STAGE_CD", referencedColumnName = "STAGE_CD")
    private Stage stage;

    @Transient
    private String stageCode;

    @Transient
    private String stageName;

    public String getStageCode() {
        return stage == null ? stageCode : stage.getStageCd();
    }

    public String getStageName() {
        return stage == null ? stageName : stage.getStageNm();
    }

    @Transient
    private String plantCd;

    @Transient
    private String plantNm;

    public String getPlantCd() {
        return stage.getPlantCode();
    }

    public String getPlantNm() {
        return stage.getPlantName();
    }
}
