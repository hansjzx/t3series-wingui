package com.zionex.t3series.web.domain.fp.analysis;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StockOutputResult {
    
    String stockCd;
    String descTxt;
    String inventoryCd;
    String inventoryNm;
    String itemCd;
    String itemNm;
    String itemClassCd;
    LocalDateTime usableTs;
    Double usableQty;
    Double remainQty;
    LocalDateTime expireTs;
    String createdBy;
    LocalDateTime usedTs;
    Double usedQty;
    String woCd;
    String soCd;
    Object isPegging;
    
}
