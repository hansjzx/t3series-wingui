package com.zionex.t3series.web.domain.fp.result;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderTrackingResult {

    private String parent;
    private String tree;
    private String mainCol;
    private String plantCd;
    private String woCd;
    private String itemCd;
    private String itemNm;
    private String routeCd;
    private String routeNm;
    private String resourceCd;
    private String resourceNm;
    private String uom;
    private Double qty;
    private String displayColor;
    private LocalDateTime startTs;
    private LocalDateTime endTs;
    private LocalDateTime dueDt;
    private List<OrderTrackingResult> rows = new ArrayList<>();

    public void addRows(List<OrderTrackingResult> rows) {
        this.rows.addAll(rows);
    }

}
