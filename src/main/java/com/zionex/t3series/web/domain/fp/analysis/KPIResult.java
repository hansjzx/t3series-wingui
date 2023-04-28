package com.zionex.t3series.web.domain.fp.analysis;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KPIResult {

    private int totalCnt;
    private int okCnt;
    private int lateCnt;
    private int shortCnt;
    private float okRate;
    private int previousDiffTotalCnt;
    private float previousDiffOkRate;
    
}
