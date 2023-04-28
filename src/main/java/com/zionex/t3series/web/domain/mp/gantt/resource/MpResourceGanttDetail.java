package com.zionex.t3series.web.domain.mp.gantt.resource;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class MpResourceGanttDetail {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "ROUTE_ID")
    private String routeId;

    @Column(name = "ACTIVITY_ID")
    private String activityId;

    @Column(name = "QTY")
    private double qty;

}
