package com.zionex.t3series.web.domain.fp.route;

import com.zionex.t3series.web.domain.fp.organization.Stage;
import com.zionex.t3series.web.util.audit.BaseEntityFP;
import com.zionex.t3series.web.util.converter.BooleanToYNConverter;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Convert;
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
@Table(name = "TB_FP_ROUTE")
public class Route extends BaseEntityFP implements Serializable {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "ROUTE_CD")
    private String routeCd;

    @Column(name = "ROUTE_NM")
    private String routeNm;

    @Column(name = "CANDIDATE_PERIOD_CNT")
    private Long candidatePeriodCnt = 1L;

    @Column(name = "DIVIDE_TP_CD")
    private String divideTpCd = "Y";

    @Column(name = "BATCH_ROUTE_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean batchRouteYn = false;

    @Column(name = "LAZY_JC_TM_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean lazyJcTmYn = false;

    @Column(name = "LOT_SIZE_MIN")
    private Double lotSizeMin;

    @Column(name = "LOT_SIZE_MAX")
    private Double lotSizeMax;

    @Column(name = "LOT_SIZE_MULTIPLR")
    private Double lotSizeMultiplr;

    @Column(name = "DESC_TXT")
    private String descTxt;

    @ManyToOne
    @JoinColumn(name = "ROUTE_GRP_CD", referencedColumnName = "ROUTE_GRP_CD")
    private RouteGrp routeGrp;

    @Transient
    private String routeGroupCode;

    @Transient
    private String routeGroupName;

    @ManyToOne
    @JoinColumn(name = "STAGE_CD", referencedColumnName = "STAGE_CD")
    private Stage stage;

    @Transient
    private String stageCode;

    @Transient
    private String stageName;

    public String getRouteGroupCode() {
        return routeGrp == null ? routeGroupCode : routeGrp.getRouteGrpCd();
    }

    public String getRouteGroupName() {
        return routeGrp == null ? routeGroupName : routeGrp.getRouteGrpNm();
    }

    public String getStageCode() {
        return stage == null ? stageCode : stage.getStageCd();
    }

    public String getStageName() {
        return stage == null ? stageName : stage.getStageNm();
    }

    public String getPlantCode() {
        return stage.getPlantCode();
    }

    public String getPlantName() {
        return stage.getPlantName();
    }
}
