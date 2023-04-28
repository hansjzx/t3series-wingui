package com.zionex.t3series.web.domain.fp.gantt.resource;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ActivityDetail {

    private String itemCd;
    private String qty;
    private LocalDateTime startTs;
    private LocalDateTime endTs;
    private String tsDiff;
    private String resourceCd;
    private String routeCd;
    private Boolean wipYn;
    private String woCd;
    private String inventoryCd;
    private String shptQty;
    private LocalDateTime dueDt;
    private LocalDateTime woStartTs;
    private LocalDateTime woEndTs;
    private String woTsDiff;
    private Boolean lateYn;
    private Long planSeq;
    private String soCd;
    private String requestQty;
    private String customerCd;
    
}
