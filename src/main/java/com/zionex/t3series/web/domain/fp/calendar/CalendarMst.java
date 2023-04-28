package com.zionex.t3series.web.domain.fp.calendar;

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
@Table(name = "TB_FP_CALENDAR_MST")
public class CalendarMst extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "CALENDAR_CD")
    private String calendarCd;

    @Column(name = "CALENDAR_NM")
    private String calendarNm;

    @Column(name = "DESC_TXT")
    private String descTxt;
    
}
