package com.zionex.t3series.web.domain.fp.calendar;

import com.zionex.t3series.web.util.audit.BaseEntityFP;
import com.zionex.t3series.web.util.converter.ColorConverter;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_FP_CALENDAR_DTL")
public class CalendarDtl extends BaseEntityFP {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "CALENDAR_CD")
    private String calendarCd;

    @Column(name = "PERIOD_CD")
    private String periodCd;

    @Column(name = "CALENDAR_TP_CD")
    private String calendarTpCd = "D";

    @Column(name = "PRIORITY")
    private Long priority = 1L;

    @Column(name = "START_DT")
    private LocalDate startDt;

    @Column(name = "END_DT")
    private LocalDate endDt;

    @Column(name = "DISPLAY_COLOR")
    @Convert(converter = ColorConverter.class)
    private String displayColor;

    @Column(name = "DESC_TXT")
    private String descTxt;

    public CalendarDtl(CalendarDtl calendarDtl) {
        this.id = calendarDtl.id;
        this.calendarCd = calendarDtl.calendarCd;
        this.periodCd = calendarDtl.periodCd;
        this.calendarTpCd = calendarDtl.calendarTpCd;
        this.priority = calendarDtl.priority;
        this.startDt = calendarDtl.startDt;
        this.endDt = calendarDtl.endDt;
        this.displayColor = calendarDtl.displayColor;
        this.descTxt = calendarDtl.descTxt;
    }

}
