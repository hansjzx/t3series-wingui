package com.zionex.t3series.web.domain.fp.activity;

import com.zionex.t3series.web.util.audit.BaseEntityFP;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_FP_ACTIVITY_RELATION")
public class ActivityRelation extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "VERSION_CD")
    private String versionCd;

    @Column(name = "PREV_ACTIVITY_ID")
    private Long prevActivityId;

    @Column(name = "NEXT_ACTIVITY_ID")
    private Long nextActivityId;

    @Column(name = "USED_QTY")
    private Double usedQty;

}
