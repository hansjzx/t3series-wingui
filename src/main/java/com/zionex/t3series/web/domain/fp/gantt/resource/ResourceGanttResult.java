package com.zionex.t3series.web.domain.fp.gantt.resource;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ResourceGanttResult {

    private String plantCd;
    private String plantNm;
    private String resourceCd;
    private String resourceNm;
    private String downtimes;
    private String divisibleYDowntimes;
    private String displayColor;
    private int mergeRowCount;
    private List<ActivityInfo> activities;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ActivityInfo {

        private String plantCd;
        private String plantNm;
        private String resourceCd;
        private String resourceNm;
        private LocalDateTime startTs;
        private LocalDateTime endTs;
        private Long activityId;
        private String jcYn;
        private String displayColor;
        private Boolean lateYn;
        private Double qty;
        private String itemCd;
        private String itemNm;
        private String woCd;
        private Double prevJcTm;
        private Double nextJcTm;
        private LocalDateTime prevJcStartTs;
        private LocalDateTime prevJcEndTs;
        private LocalDateTime nextJcStartTs;
        private LocalDateTime nextJcEndTs;
        private String divisibleYDowntimes;

    }

}
