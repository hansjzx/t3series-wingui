package com.zionex.t3series.web.domain.fp.master;

import lombok.Data;

@Data
public class ToolSettingMaster {

    private String id;

    private String routeCode;
    private String routeName;

    private String borSetCode;
    private String borSetMstDescTxt;

    private String resourceCode;
    private String resourceName;

    private Long usableCnt;

    private Boolean isTool;

    private Long toolCnt;

}
