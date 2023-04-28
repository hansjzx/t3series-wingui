package com.zionex.t3series.web.domain.fp.bor;

import com.zionex.t3series.web.domain.fp.resource.Resource;
import com.zionex.t3series.web.util.audit.BaseEntityFP;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

@Data
@EqualsAndHashCode(callSuper = false)
@DynamicUpdate
@Entity
@Table(name = "TB_FP_BOR_SET_TOOL")
public class BorSetTool extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "BOR_SET_CD")
    private String borSetCd;

    @Column(name = "USABLE_CNT")
    private Long usableCnt;

    @Column(name = "DESC_TXT")
    private String descTxt;

    @ManyToOne
    @JoinColumn(name = "TOOL_RESOURCE_CD", referencedColumnName = "RESOURCE_CD")
    private Resource resource;

    @Transient
    private String toolResourceCode;

    @Transient
    private String toolResourceName;

    @Transient
    private Long toolCnt;

    public String getToolResourceCode() {
        return resource == null ? toolResourceCode : resource.getResourceCd();
    }

    public String getToolResourceName() {
        return resource == null ? toolResourceName : resource.getResourceNm();
    }

    public Long getToolCnt() {
        return resource == null ? toolCnt : resource.getToolCnt();
    }

    public String getToolResourceCd() {
        return getToolResourceCode();
    }

    public String getUniqueKey() {
        return getBorSetCd() + "_" + getToolResourceCode();
    }

}
