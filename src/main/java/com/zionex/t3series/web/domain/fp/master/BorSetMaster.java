package com.zionex.t3series.web.domain.fp.master;

import lombok.Data;

@Data
public class BorSetMaster {

    private String id;
    private String itemCode;
    private String itemName;
    private String itemClassCode;

    private String inventoryCode;
    private String inventoryName;

    private String routeCode;
    private String routeName;

    private String borSetCode;
    private String mstDescTxt;

    private String resourceCode;
    private String resourceName;
    private String resourceTpCd;
}
