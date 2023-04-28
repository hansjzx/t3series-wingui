package com.zionex.t3series.web.domain.fp.stock;

import com.zionex.t3series.web.util.audit.BaseEntityFP;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_FP_STOCK_INPUT_PLAN")
public class StockInputPlan extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "VERSION_CD")
    private String versionCd;

    @Column(name = "PLANT_CD")
    private String plantCd;

    @Column(name = "STAGE_CD")
    private String stageCd;

    @Column(name = "STOCK_CD")
    private String stockCd;

    @Column(name = "AVAIL_TS")
    private LocalDateTime availTs;

    @Column(name = "AVAIL_QTY")
    private Double availQty = 0d;

    @Column(name = "WO_CD")
    private String woCd;

    @Column(name = "ACTIVITY_ID")
    private Long activityId;

    @Column(name = "INVENTORY_CD")
    private String inventoryCd;

    @Column(name = "ROUTE_CD")
    private String routeCd;
    
}
