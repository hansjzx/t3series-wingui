package com.zionex.t3series.web.domain.fp.master;

import com.zionex.t3series.web.domain.admin.lang.LangPackService;
import com.zionex.t3series.web.domain.fp.calendar.CalendarDtl;
import com.zionex.t3series.web.domain.fp.calendar.CalendarDtlService;
import com.zionex.t3series.web.domain.fp.calendar.CalendarMst;
import com.zionex.t3series.web.domain.fp.calendar.CalendarMstService;
import com.zionex.t3series.web.domain.fp.calendar.Period;
import com.zionex.t3series.web.domain.fp.calendar.PeriodQueryRepository;
import com.zionex.t3series.web.domain.fp.calendar.PeriodService;
import com.zionex.t3series.web.domain.fp.resource.Resource;
import com.zionex.t3series.web.domain.fp.resource.ResourceService;
import com.zionex.t3series.web.util.ResponseEntityUtil;
import com.zionex.t3series.web.util.ResponseEntityUtil.ResponseMessage;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceCalendarMstService {
    
    private static final String CALENDAR_CD_PREFIX = "CAL";
    private static final String PERIOD_CD_PREFIX = "PERIOD";
    
    private final PeriodQueryRepository periodQueryRepository;
    private final ResourceService resourceService;
    private final CalendarMstService calendarMstService;
    private final CalendarDtlService calendarDtlService;
    private final PeriodService periodService;
    private final LangPackService langPackService;
    
    public List<CalendarResult> getEvents(String resourceParam) {
        return periodQueryRepository.getEvents(resourceParam);
    }

    @Transactional
    public void saveEvent(CalendarResult event) {
        Resource resource = resourceService.getResource(event.getResourceCd());
        String calendarCd = resource.getCalendarCd();
        String newCalendarCd = getNewCalendarCd(resource.getResourceCd());

        Period period = new Period();
        String newPeriodCd = getNewPeriodCd();
        period.setPeriodCd(newPeriodCd);
        period.setStartTs(event.getStart());
        period.setEndTs(event.getEnd());
        period.setCycleTpCd(event.getCycleTp());
        period.setDescTxt(event.getTitle());
        periodService.savePeriod(period);

        CalendarDtl calendarDtl = new CalendarDtl();
        calendarDtl.setCalendarCd(newCalendarCd);
        calendarDtl.setPeriodCd(newPeriodCd);
        calendarDtl.setCalendarTpCd(event.getCalendarTp());
        calendarDtl.setDisplayColor(event.getDisplayColor());

        if (calendarCd == null) {
            calendarDtl.setPriority(1L);
            calendarDtlService.saveCalendarDtl(calendarDtl);
        } else {
            String periodCd = event.getPeriodCd();
            List<CalendarDtl> calendarDtls = calendarDtlService.getCalendarDtlsByCalendarCd(resource.getCalendarCd())
                    .stream()
                    .filter(prevCalendarDtl -> (periodCd == null) || !periodCd.equals(prevCalendarDtl.getPeriodCd()))
                    .map(prevCalendarDtl -> {
                        CalendarDtl newCalendarDtl = new CalendarDtl(prevCalendarDtl);
                        newCalendarDtl.setId(null);
                        newCalendarDtl.setCalendarCd(newCalendarCd);
                        if (periodCd == null) {
                            newCalendarDtl.setPriority(prevCalendarDtl.getPriority() + 1);
                        }
                        return newCalendarDtl;
                    }).collect(Collectors.toList());
            calendarDtl.setPriority((periodCd == null) ? 1L : event.getPriority());
            calendarDtls.add(calendarDtl);
            calendarDtlService.saveCalendarDtls(calendarDtls);
        }

        CalendarMst calendarMst = new CalendarMst();
        calendarMst.setCalendarCd(newCalendarCd);
        calendarMstService.saveCalendarMst(calendarMst);

        resource.setCalendarCd(newCalendarCd);
        resourceService.saveResource(resource);
    }

    @Transactional
    public void deleteEvent(String resourceCd, String periodsCd) {
        String newCalendarCd = getNewCalendarCd(resourceCd);
        CalendarMst calendarMst = new CalendarMst();
        calendarMst.setCalendarCd(newCalendarCd);

        Resource resource = resourceService.getResource(resourceCd);
        List<CalendarDtl> calendarDtls = calendarDtlService.getCalendarDtlsByCalendarCd(resource.getCalendarCd())
                .stream()
                .filter(calendarDtl -> !periodsCd.equals(calendarDtl.getPeriodCd()))
                .map(calendarDtl -> {
                    CalendarDtl newCalendarDtl = new CalendarDtl(calendarDtl);
                    newCalendarDtl.setId(null);
                    newCalendarDtl.setCalendarCd(newCalendarCd);
                    return newCalendarDtl;
                }).collect(Collectors.toList());
        resource.setCalendarCd(newCalendarCd);
        
        try {
            resourceService.saveResource(resource);
            calendarMstService.saveCalendarMst(calendarMst);
            calendarDtlService.saveCalendarDtls(calendarDtls);
        } catch (Exception ignored) {
        }        
    }

    @Transactional
    public void copyEvent(CalendarResult event) {
        List<CalendarMst> newCalendarMsts = new ArrayList<>();
        List<CalendarDtl> newCalendarDtls = new ArrayList<>();
        List<Resource> updateResources = new ArrayList<>();

        String periodCd = event.getPeriodCd();
        Period period = periodService.getPeriodByPeriodCd(periodCd);
        period.setStartTs(event.getStart());
        period.setEndTs(event.getEnd());
        period.setCycleTpCd(event.getCycleTp());
        period.setDescTxt(event.getTitle());
        
        List<Resource> resources = resourceService.getResources();
        for (Resource resource : resources) {
            CalendarDtl calendarDtl;
            String calendarCd = resource.getCalendarCd();
            String newCalendarCd = getNewCalendarCd(resource.getResourceCd());
            if (calendarCd == null) {                
                CalendarMst calendarMst = new CalendarMst();
                calendarMst.setCalendarCd(newCalendarCd);
                newCalendarMsts.add(calendarMst);
                resource.setCalendarCd(newCalendarCd);
                updateResources.add(resource);
            }            
            calendarDtl = calendarDtlService.getCalendarDtlByCalendarCdAndPeriodCd(calendarCd, periodCd);
            if (calendarDtl == null) {
                calendarDtl = new CalendarDtl();
                calendarDtl.setCalendarCd(resource.getCalendarCd());
                calendarDtl.setPriority(1L);
                calendarDtl.setPeriodCd(periodCd);
                calendarDtl.setCalendarTpCd(event.getCalendarTp());
            }
            calendarDtl.setDisplayColor(event.getDisplayColor());
            newCalendarDtls.add(calendarDtl);
        }

        try {
            resourceService.saveResources(updateResources);
            calendarMstService.saveCalendarMsts(newCalendarMsts);
            calendarDtlService.saveCalendarDtls(newCalendarDtls);
            periodService.savePeriod(period);
        } catch (Exception ignored) {
        }
    }

    @Transactional
    public ResponseEntity<ResponseMessage> copyCalendar(String resourceCdToCopy, List<String> targetResourceCds) {
        String resultMsg;
        List<CalendarMst> newCalendarMsts = new ArrayList<>();
        List<CalendarDtl> newCalendarDtls = new ArrayList<>();
        List<Resource> updateResources = new ArrayList<>();

        Map<String, Resource> resourceMap = resourceService.getResources()
                .stream()
                .collect(Collectors.toMap(Resource::getResourceCd, Function.identity()));
        Resource resourceToCopy = resourceService.getResource(resourceCdToCopy);
        String calendarCdToCopy = resourceToCopy.getCalendarCd();

        if (StringUtils.isEmpty(calendarCdToCopy)) {
            resultMsg = langPackService.getLanguageValue("FP_MSG_NO_RESOURCE_CALENDAR");
            return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), resultMsg));
        } else {
            List<CalendarDtl> calendarDtlsToCopy = calendarDtlService.getCalendarDtlsByCalendarCd(calendarCdToCopy);
            for (String resourceCd : targetResourceCds) {
                String newCalendarCd = getNewCalendarCd(resourceCd);
                CalendarMst calendarMst = new CalendarMst();
                calendarMst.setCalendarCd(newCalendarCd);
                newCalendarMsts.add(calendarMst);

                List<CalendarDtl> calendarDtls = calendarDtlsToCopy.stream()
                        .map(calendarDtl -> {
                            CalendarDtl newCalendarDtl = new CalendarDtl(calendarDtl);
                            newCalendarDtl.setId(null);
                            newCalendarDtl.setCalendarCd(newCalendarCd);
                            return newCalendarDtl;
                        }).collect(Collectors.toList());
                newCalendarDtls.addAll(calendarDtls);

                Resource resource = resourceMap.get(resourceCd);
                resource.setCalendarCd(newCalendarCd);
                updateResources.add(resource);
            }

            try {
                calendarMstService.saveCalendarMsts(newCalendarMsts);
                calendarDtlService.saveCalendarDtls(newCalendarDtls);
                resourceService.saveResources(updateResources);
                resultMsg = langPackService.getLanguageValue("FP_MSG_SUCCESS_CALENDAR_COPY");
                return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), resultMsg));
            } catch (Exception e) {
                resultMsg = langPackService.getLanguageValue("FP_MSG_FAIL_CALENDAR_COPY");
                return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(), resultMsg));
            }
        }
    }

    private static String getNewCalendarCd(String resourceCd) {
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return CALENDAR_CD_PREFIX + "_" + resourceCd + "_" + now;
    }

    private static String getNewPeriodCd() {
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return PERIOD_CD_PREFIX + "_" + now;
    }
    
}
