package com.zionex.t3series.web.domain.fp.simulation;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class SimulationDetails {
    
    private Long stepSeq;
    private String stepCd;
    private String stepDescTxt;
    private String statusTpCd;
    private String versionCd;
    private String policyCd;
    private String versionDescTxt;
    private String execTpCd;
    private LocalDate planDt;
    private LocalDateTime startTs;
    private LocalDateTime endTs;
    private String createdBy;
    private LocalDateTime createdAt;
    
}
