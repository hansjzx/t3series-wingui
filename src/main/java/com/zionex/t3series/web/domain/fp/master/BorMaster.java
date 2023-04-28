package com.zionex.t3series.web.domain.fp.master;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BorMaster {

    private String id;
    private String itemCode;
    private String itemName;
    private String itemClassCode;

    private String inventoryCode;
    private String inventoryName;

    private String routeCode;
    private String routeName;

    private String resourceCode;
    private String resourceName;

    private String descTxt;
    private Long altResourcePriority;

    private String timeUom;

    private Double queueTm;
    private Double setupTm;
    private Double processTm;
    private Double waitTm;
    private Double moveTm;

    private Double lotSizeMin;
    private Double lotSizeMax;
    private Double lotSizeMultiplr;

    private Double efficiency;

    private String processTmTpCd;
    private Double stdProcessTm;
    private Double transferBatchTm;
    private String divideTpCd;

    private String createdBy;
    private LocalDateTime createdAt;
    private String updatedBy;
    private LocalDateTime updatedAt;

}
