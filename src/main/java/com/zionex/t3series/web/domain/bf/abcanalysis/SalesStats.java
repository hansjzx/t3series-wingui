package com.zionex.t3series.web.domain.bf.abcanalysis;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.zionex.t3series.web.util.audit.BaseEntity;

import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_BF_SALES_STATS")
public class SalesStats extends BaseEntity {
    
    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "THLD_A")
    private Float thldA;
    
    @Column(name = "THLD_B")
    private Float thldB;
        
    @Column(name = "THLD_X")
    private Float thldX;
        
    @Column(name = "THLD_Y")
    private Float thldY;
}