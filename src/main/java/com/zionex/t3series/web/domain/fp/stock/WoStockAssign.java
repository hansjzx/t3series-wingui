package com.zionex.t3series.web.domain.fp.stock;

import com.zionex.t3series.web.util.audit.BaseEntityFP;
import com.zionex.t3series.web.util.converter.BooleanToYNConverter;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_FP_WO_STOCK_ASSIGN")
public class WoStockAssign extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "WO_CD")
    private String woCd;

    @Column(name = "STOCK_CD")
    private String stockCd;

    @Column(name = "ASSIGN_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean assignYn;

}
