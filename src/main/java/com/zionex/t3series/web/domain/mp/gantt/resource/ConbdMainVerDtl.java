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
@Table(name = "TB_CM_CONBD_MAIN_VER_DTL")
public class ConbdMainVerDtl {
    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @JsonProperty("ID")
    @Column(name = "ID")
    private String id;

    @JsonProperty("CONBD_MAIN_VER_MST_ID")
    @Column(name = "CONBD_MAIN_VER_MST_ID")
    private String conbdMainVerMstId;

    @JsonProperty("PLAN_SNRIO_MGMT_DTL_ID")
    @Column(name = "PLAN_SNRIO_MGMT_DTL_ID")
    private String planSnrioMgmtDtlId;

    @JsonProperty("LOAD_STRT_DTTM")
    @Column(name = "LOAD_STRT_DTTM")
    private String loadStrtDttm;

    @JsonProperty("LOAD_END_DTTM")
    @Column(name = "LOAD_END_DTTM")
    private String loadEndDttm;

    @JsonProperty("PLAN_STRT_DTTM")
    @Column(name = "PLAN_STRT_DTTM")
    private String planStrtDttm;

    @JsonProperty("PLAN_END_DTTM")
    @Column(name = "PLAN_END_DTTM")
    private String planEndDttm;

    @JsonProperty("STRT_DTTM")
    @Column(name = "STRT_DTTM")
    private String strtDttm;

    @JsonProperty("END_DTTM")
    @Column(name = "END_DTTM")
    private String endDttm;

    @JsonProperty("ELAPSED_TIME")
    @Column(name = "ELAPSED_TIME")
    private String elapsedTime;

    @JsonProperty("EXE_STATUS_ID")
    @Column(name = "EXE_STATUS_ID")
    private String exeStatusId;

    @JsonProperty("STEP_STATUS_ID")
    @Column(name = "STEP_STATUS_ID")
    private String stepStatusId;

    @JsonProperty("SIMUL_VER_ID")
    @Column(name = "SIMUL_VER_ID")
    private String simulVerId;

    @JsonProperty("SIMUL_VER_DESCRIP")
    @Column(name = "SIMUL_VER_DESCRIP")
    private String simulVerDescrip;

    @JsonProperty("REFER_CONBD_MAIN_VER_DTL_ID")
    @Column(name = "REFER_CONBD_MAIN_VER_DTL_ID")
    private String referConbdMainVerDtlId;

    @JsonProperty("CONFRM_YN")
    @Column(name = "CONFRM_YN")
    private String confrmYn;

    @JsonProperty("CONFRM_DTTM")
    @Column(name = "CONFRM_DTTM")
    private String confrmDttm;

    @JsonProperty("CONFRM_EMP_ID")
    @Column(name = "CONFRM_EMP_ID")
    private String confrmEmpId;

    @JsonProperty("ERR")
    @Column(name = "ERR")
    private String err;

    @JsonProperty("REVISION_ID")
    @Column(name = "REVISION_ID")
    private String revisionId;

    @JsonProperty("CREATE_BY")
    @Column(name = "CREATE_BY")
    private String createBy;

    @JsonProperty("CREATE_DTTM")
    @Column(name = "CREATE_DTTM")
    private String createDttm;

    @JsonProperty("MODIFY_BY")
    @Column(name = "MODIFY_BY")
    private String modifyBy;

    @JsonProperty("MODIFY_DTTM")
    @Column(name = "MODIFY_DTTM")
    private String modifyDttm;

}
