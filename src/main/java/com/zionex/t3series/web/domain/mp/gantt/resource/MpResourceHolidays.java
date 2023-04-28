package com.zionex.t3series.web.domain.mp.gantt.resource;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@DynamicUpdate
@Entity
@Table(name = "TB_RT_MP_RESOURCE_HOLIDAYS")
public class MpResourceHolidays {
    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @JsonProperty("ID")
    @Column(name = "ID")
    private String id;

    @JsonProperty("CONBD_MAIN_VER_DTL_ID")
    @Column(name = "CONBD_MAIN_VER_DTL_ID")
    private String conbdMainVerDtlId;

    @JsonProperty("RESOURCE_ID")
    @Column(name = "RESOURCE_ID")
    private String resourceId;

    @JsonProperty("STRT_DATE")
    @Column(name = "STRT_DATE")
    private String strtDate;

    @JsonProperty("END_DATE")
    @Column(name = "END_DATE")
    private String endDate;

    @JsonProperty("CREATE_BY")
    @Column(name = "CREATE_BY")
    private String createBy;

    @JsonProperty("CREATE_DTTM")
    @Column(name = "CREATE_DTTM")
    private String createDttm;

    @JsonProperty("CREATE_DTTM")
    @Column(name = "MODIFY_BY")
    private String modifyBy;

    @JsonProperty("MODIFY_DTTM")
    @Column(name = "MODIFY_DTTM")
    private String modifyDttm;

}
