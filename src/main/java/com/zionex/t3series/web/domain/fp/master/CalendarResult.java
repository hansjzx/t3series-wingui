package com.zionex.t3series.web.domain.fp.master;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CalendarResult {
    
    private LocalDateTime start;
    private LocalDateTime end;
    private String cycleTp;
    private String title;
    private String displayColor;
    private String calendarCd;
    private String resourceCd;
    private String periodCd;
    private String calendarTp;
    private Long priority;
    private boolean copyToAllResource = false;
    
}
