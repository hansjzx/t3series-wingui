package com.zionex.t3series.web.domain.mp.gantt.resource;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MpResourceGanttResult {

    private String resourceId;

    private Integer displaySeq;

    private String holidays;

    private List<Activities> activities;

    @Data
    @Builder
    public static class Activities {
        private String id;
        private String inventoryId;
        private String planorderId;
        private LocalDateTime bucketStrtDt;
        private LocalDateTime bucketEndDt;
        private LocalDateTime strtDt;
        private LocalDateTime endDt;
        private String color;
        private double actHeight;
        private String text;
    }
    
}
