package com.zionex.t3series.web.domain.mp.gantt.resource;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class MpResourceHoliday implements Serializable {

    private static final long serialVersionUID = -775385455658613351L;

    @Id
    @Column(name = "RESOURCE_ID")
    private String resourceId;

    @Id
    @Column(name = "STRT_DATE")
    private String strtDate;

    @Id
    @Column(name = "END_DATE")
    private String endDate;
    
}
