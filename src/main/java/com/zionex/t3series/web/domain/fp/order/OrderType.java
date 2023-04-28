package com.zionex.t3series.web.domain.fp.order;

import com.zionex.t3series.web.util.audit.BaseEntityFP;
import com.zionex.t3series.web.util.converter.BooleanToYNConverter;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@DynamicUpdate
@Entity
@Table(name = "TB_FP_ORDER_TYPE")
public class OrderType extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "ORDER_TP_CD")
    private String orderTpCd;

    @Column(name = "ORDER_EFFICIENCY")
    private Double orderEfficiency;

    @Column(name = "ORDER_PST")
    private LocalDateTime orderPst;

    @Column(name = "ATTR_GRP_CD")
    private String attrGrpCd;

    @Column(name = "TO_STOCK_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean toStockYn;

    @Column(name = "CANC_ON_LATE_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean cancOnLateYn;

    @Column(name = "CANC_ON_SHTG_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean cancOnShtgYn;

    @Column(name = "ORDER_STRATEGY_TP_CD")
    private String orderStrategyTpCd;

    @Transient
    private Boolean isDeletable;

}
