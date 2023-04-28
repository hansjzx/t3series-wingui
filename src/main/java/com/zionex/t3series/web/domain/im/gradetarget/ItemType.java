package com.zionex.t3series.web.domain.im.gradetarget;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.zionex.t3series.web.util.converter.BooleanToYNConverter;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@DynamicUpdate
@Entity
@Table(name = "TB_CM_ITEM_TYPE")
public class ItemType {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @JsonProperty("ID")
    @Column(name = "ID")
    private String id;

    @JsonProperty("CONF_ID")
    @Column(name = "CONF_ID")
    private String confId;

    @JsonProperty("ITEM_TP")
    @Column(name = "ITEM_TP")
    private String itemTp;

    @JsonProperty("CONVN_NM")
    @Column(name = "CONVN_NM")
    private String convnNm;

    @JsonProperty("ITEM_TP_CD_ID")
    @Column(name = "ITEM_TP_CD_ID")
    private String itemTpCdId;

    @JsonProperty("ACTV_YN")
    @Column(name = "ACTV_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean actvYn;

    @JsonProperty("CREATE_BY")
    @Column(name = "CREATE_BY", updatable = false)
    private String createBy;

    @JsonProperty("CREATE_DTTM")
    @Column(name = "CREATE_DTTM", updatable = false)
    private LocalDateTime createDttm;

    @JsonProperty("MODIFY_BY")
    @Column(name = "MODIFY_BY")
    private String modifyBy;

    @JsonProperty("MODIFY_DTTM")
    @Column(name = "MODIFY_DTTM")
    private LocalDateTime modifyDttm;
}
