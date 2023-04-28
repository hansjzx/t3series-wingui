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
@Table(name = "TB_FP_STOCK_OUTPUT_PLAN")
public class StockOutputPlan extends BaseEntityFP {

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

    @Column(name = "WO_CD")
    private String woCd;

    @Column(name = "ACTIVITY_ID")
    private Long activityId;

    @Column(name = "USED_TS")
    private LocalDateTime usedTs;

    @Column(name = "USED_QTY")
    private Double usedQty = 0d;

    @Column(name = "INVENTORY_CD")
    private String inventoryCd;

}
