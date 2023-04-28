package com.zionex.t3series.web.domain.fp.simulation;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SimulationHistory {
    
    private String mainVersionCd;
    private String planVersionCd;
    private String descTxt;
    private String policyCd;
    private Boolean confirmYn;
    private LocalDateTime startTs;
    private LocalDateTime endTs;
    private String statusLog;
    private String user;
    private String hasOptions;
    
}
