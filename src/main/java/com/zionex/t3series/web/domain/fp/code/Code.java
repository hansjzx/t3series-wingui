package com.zionex.t3series.web.domain.fp.code;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.zionex.t3series.web.util.audit.BaseEntityFP;

import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity(name = "fpCode")
@Table(name = "TB_FP_CODE")
public class Code extends BaseEntityFP {
    
    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "CODE_GRP_CD")
    private String codeGroupCd;

    @Column(name = "CODE_CD")
    private String codeCd;

    @Column(name = "CODE_SEQ")
    private Long codeSeq;

    @Column(name = "DESC_TXT")
    private String descripText;

}
