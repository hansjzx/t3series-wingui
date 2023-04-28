package com.zionex.t3series.web.domain.mp.gantt.resource;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@DynamicUpdate
@Entity
@Table(name = "TB_RT_MP_RESOURCE_GANTT")
public class MpResourceGantt {
    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @JsonProperty("ID")
    @Column(name = "ID")
    private String id;

    @JsonProperty("CONBD_MAIN_VER_DTL_ID")
    @Column(name = "CONBD_MAIN_VER_DTL_ID")
    private String conbdMainVerDtlId;

    @JsonProperty("RESOURCE_ID")
    @Column(name = "RESOURCE_ID")
    private String resourceId;

    @JsonProperty("ROUTE_ID")
    @Column(name = "ROUTE_ID")
    private String routeId;

    @JsonProperty("INVENTORY_ID")
    @Column(name = "INVENTORY_ID")
    private String inventoryId;

    @JsonProperty("DMND_ID")
    @Column(name = "DMND_ID")
    private String dmndId;

    @JsonProperty("PLANORDER_ID")
    @Column(name = "PLANORDER_ID")
    private String planorderId;

    @JsonProperty("ACTIVITY_ID")
    @Column(name = "ACTIVITY_ID")
    private String activityId;

    @JsonProperty("BUCKET_STRT_DATE")
    @Column(name = "BUCKET_STRT_DATE")
    private LocalDateTime bucketStrtDate;

    @JsonProperty("BUCKET_END_DATE")
    @Column(name = "BUCKET_END_DATE")
    private LocalDateTime bucketEndDate;

    @JsonProperty("STRT_DATE")
    @Column(name = "STRT_DATE")
    private LocalDateTime strtDate;

    @JsonProperty("END_DATE")
    @Column(name = "END_DATE")
    private LocalDateTime endDate;

    @JsonProperty("COLOR")
    @Column(name = "COLOR")
    private String color;

    @JsonProperty("QTY")
    @Column(name = "QTY")
    private Double qty;

    @JsonProperty("ACT_HEIGHT")
    @Column(name = "ACT_HEIGHT")
    private Double actHeight;

    @JsonProperty("DISPLAY_SEQ")
    @Column(name = "DISPLAY_SEQ")
    private Integer displaySeq;

    @JsonProperty("CREATE_BY")
    @Column(name = "CREATE_BY")
    private String createBy;

    @JsonProperty("CREATE_DTTM")
    @Column(name = "CREATE_DTTM")
    private String createDttm;

    @JsonProperty("MODIFY_BY")
    @Column(name = "MODIFY_BY")
    private String modifyBy;

    @JsonProperty("MODIFY_DTTM")
    @Column(name = "MODIFY_DTTM")
    private String modifyDttm;

}
