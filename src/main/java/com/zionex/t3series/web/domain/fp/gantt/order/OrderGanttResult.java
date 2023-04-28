package com.zionex.t3series.web.domain.fp.gantt.order;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrderGanttResult {

    private String parent;
    private String tree;
    private String id;
    private String mainCol;
    private String woCd;
    private String plantCd;
    private String plantNm;
    private String activityId;
    private String itemCd;
    private String itemNm;
    private String itemUom;
    private String resourceCd;
    private Double qty;
    private String displayColor;
    private String startTs;
    private String endTs;
    private String dueDt;
    private String anc;
    private Double plantNmRowSpan;
    private String mainColColor;
    @JsonProperty("Items")
    List<OrderGanttResult> Items;

}
