package com.zionex.t3series.web.domain.fp.resource;

import com.zionex.t3series.web.domain.fp.organization.Plant;
import com.zionex.t3series.web.domain.fp.organization.Stage;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_FP_RESRC_UTILIZATION")
public class ResrcUtilization {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "VERSION_CD")
    private String versionCd;

    @Column(name = "START_TS")
    private LocalDateTime startTs;

    @Column(name = "END_TS")
    private LocalDateTime endTs;

    @Column(name = "USED_TM")
    private Long usedTm;

    @Column(name = "USED_RATE")
    private Double usedRate;

    @Column(name = "AVAIL_TM")
    private Long availTm;

    @Column(name = "AVAIL_RATE")
    private Double availRate;

    @Column(name = "TIME_UOM")
    private String timeUom;

    @ManyToOne
    @JoinColumn(name = "PLANT_CD", referencedColumnName = "PLANT_CD")
    private Plant plant;

    @Transient
    private String plantCode;

    @Transient
    private String plantName;

    @ManyToOne
    @JoinColumn(name = "STAGE_CD", referencedColumnName = "STAGE_CD")
    private Stage stage;

    @Transient
    private String stageCode;

    @Transient
    private String stageName;

    @ManyToOne
    @JoinColumn(name = "RESOURCE_CD", referencedColumnName = "RESOURCE_CD")
    private Resource resource;

    @Transient
    private String resourceCode;

    @Transient
    private String resourceName;

    public String getPlantCode() {
        return plant == null ? plantCode : plant.getPlantCd();
    }

    public String getPlantName() {
        return plant == null ? plantName : plant.getPlantNm();
    }

    public String getStageCode() {
        return stage == null ? stageCode : stage.getStageCd();
    }

    public String getStageName() {
        return stage == null ? stageName : stage.getStageNm();
    }

    public String getResourceCode() {
        return resource == null ? resourceCode : resource.getResourceCd();
    }

    public String getResourceName() {
        return resource == null ? resourceName : resource.getResourceNm();
    }

}
