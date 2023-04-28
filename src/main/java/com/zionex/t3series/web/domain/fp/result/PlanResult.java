package com.zionex.t3series.web.domain.fp.result;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PlanResult {

    private String plantCd;
    private String plantNm;
    private String resourceCd;
    private String resourceNm;
    private String itemCd;
    private String itemNm;
    private String itemUom;
    private Double qty;
    private LocalDateTime startTs;

    @Data
    public static class PlanResultDetail {

        private String woCd;
        private String plantCd;
        private String resourceCd;
        private String itemCd;
        private Double planQty;
        private Double totalQty;
        private LocalDateTime totalStart;
        private LocalDateTime totalEnd;

    }

}
