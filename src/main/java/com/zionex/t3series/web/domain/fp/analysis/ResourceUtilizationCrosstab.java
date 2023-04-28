package com.zionex.t3series.web.domain.fp.analysis;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResourceUtilizationCrosstab {
    
    String plantCd;
    String plantNm;
    String stageCd;
    String stageNm;
    String resourceCd;
    String resourceNm;
    String analysisIndicator;
    Object[] pivotData;
    
}
