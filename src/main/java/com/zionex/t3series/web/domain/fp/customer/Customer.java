package com.zionex.t3series.web.domain.fp.customer;

import com.zionex.t3series.web.util.audit.BaseEntityFP;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Data
@EqualsAndHashCode(callSuper = false)
@DynamicUpdate
@Entity
@Table(name = "TB_FP_CUSTOMER")
public class Customer extends BaseEntityFP implements Serializable {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "CUSTOMER_CD")
    private String customerCd;

    @Column(name = "CUSTOMER_NM")
    private String customerNm;

    @Column(name = "CATEGORY")
    private String category;

    @Column(name = "PRIORITY")
    private Long priority;

    @Column(name = "DESC_TXT")
    private String descTxt;

}
