package com.zionex.t3series.web.domain.fp.gantt.resource;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ActivityDivisibleYDowntime {

    private String resourceCd;
    private Long activityId;
    private String woCd;
    private LocalDateTime downStart;
    private LocalDateTime downEnd;

}
