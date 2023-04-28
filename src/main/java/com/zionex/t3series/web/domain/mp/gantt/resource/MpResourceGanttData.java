package com.zionex.t3series.web.domain.mp.gantt.resource;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class MpResourceGanttData {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "RESOURCE_ID")
    private String resourceId;

    @Column(name = "INVENTORY_ID")
    private String inventoryId;

    @Column(name = "PLANORDER_ID")
    private String planorderId;

    @Column(name = "BUCKET_STRT_DATE")
    private LocalDateTime bucketStrtDate;

    @Column(name = "BUCKET_END_DATE")
    private LocalDateTime bucketEndDate;

    @Column(name = "STRT_DATE")
    private LocalDateTime strtDate;

    @Column(name = "END_DATE")
    private LocalDateTime endDate;

    @Column(name = "COLOR")
    private String color;

    @Column(name = "QTY")
    private double qty;

    @Column(name = "ACT_HEIGHT")
    private double actHeight;

    @Column(name = "DISPLAY_SEQ")
    private Integer displaySeq;

}
