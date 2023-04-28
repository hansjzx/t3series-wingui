package com.zionex.t3series.web.domain.mp.gantt.resource;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class MpPlanHorizon {

    @Id
    @Column(name = "SIMUL_VER_ID")
    private String simulVerId;

    @Column(name = "BASE_BUCKET_UOM")
    private String baseBucketUom;

    @Column(name = "VAR_BUCKET_UOM")
    private String resCd;

    @Column(name = "ZONE1_START")
    private String zone1Start;

    @Column(name = "ZONE2_START")
    private String zone2Start;

    @Column(name = "END_DATE")
    private String endTime;

    @Column(name = "DESCRIP")
    private String descrip;
}
