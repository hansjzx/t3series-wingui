package com.zionex.t3series.web.domain.fp.master;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.util.ResponseEntityUtil.ResponseMessage;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/master/resource-calendar/")
public class ResourceCalendarMstController {
    
    private final ResourceCalendarMstService resourceCalendarMstService;

    private final ObjectMapper objectMapper;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("events")
    public List<CalendarResult> getEvents(@RequestParam("resource") String resourceParam) {
        return resourceCalendarMstService.getEvents(resourceParam); 
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("events")
    public void saveEvent(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final CalendarResult calendarResult = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<CalendarResult>() {});
        
        resourceCalendarMstService.saveEvent(calendarResult);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("events/delete")
    public void deleteEvent(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final Map<String, String> data = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<Map<String, String>>() {});

        resourceCalendarMstService.deleteEvent(data.get("resourceCd"), data.get("periodCd"));
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("events/copy")
    public void copyEvent(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final CalendarResult calendarResult = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<CalendarResult>() {});
        
        resourceCalendarMstService.copyEvent(calendarResult);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("copy")
    public ResponseEntity<ResponseMessage> copyCalendar(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final Map<String, String> data = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<Map<String, String>>() {});
        List<String> targetResourceCds = objectMapper.readValue(data.get("target-resources"), new TypeReference<List<String>>() {});
        
        return resourceCalendarMstService.copyCalendar(data.get("resource"), targetResourceCds);
    }
    
}
