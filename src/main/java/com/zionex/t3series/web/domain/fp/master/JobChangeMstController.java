package com.zionex.t3series.web.domain.fp.master;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
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
import com.zionex.t3series.web.domain.fp.Jobchange.JcTime;
import com.zionex.t3series.web.domain.fp.Jobchange.JcTimeGrp;
import com.zionex.t3series.web.domain.fp.Jobchange.JcTimeGrpService;
import com.zionex.t3series.web.domain.fp.Jobchange.JcTimeService;
import com.zionex.t3series.web.domain.fp.resource.Resource;
import com.zionex.t3series.web.domain.fp.resource.ResourceService;
import com.zionex.t3series.web.util.ResponseMessage;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/master/jobchange/")
public class JobChangeMstController {

    private final ResourceService resourceService;
    
    private final JcTimeService jcTimeService;
    
    private final JcTimeGrpService jcTimeGrpService;

    private final ObjectMapper objectMapper;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("resources")
    public List<Resource> getResources(@RequestParam(value = "searchResource", required = false) String searchResource) throws UnsupportedEncodingException {
        if (searchResource != null) {
            searchResource = URLDecoder.decode(searchResource, "UTF-8");
        }
        return resourceService.getNotToolResources(searchResource);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("resources")
    public ResponseEntity<ResponseMessage> saveResources(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<Resource> resources = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<Resource>>() {});

        resourceService.updateJobChange(resources);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated Resource entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("jctimes")
    public List<JcTime> getJcTimes(@RequestParam(value = "searchResource", required = false) String searchResource) throws UnsupportedEncodingException {
        if (searchResource != null) {
            searchResource = URLDecoder.decode(searchResource, "UTF-8");
        }
        return jcTimeService.getJcTimes(searchResource);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("jctimes")
    public ResponseEntity<ResponseMessage> saveJcTimes(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<JcTime> jcTimes = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<JcTime>>() {});

        jcTimeService.saveJcTimes(jcTimes);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated JcTime entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("jctimes/delete")
    public ResponseEntity<ResponseMessage> deleteJcTimes(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<JcTime> jcTimes = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<JcTime>>() {});

        jcTimeService.deleteJcTimes(jcTimes);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Deleted JcTime entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("jctimegroups")
    public List<JcTimeGrp> getJcTimeGroups(@RequestParam(value = "searchResource", required = false) String searchResource) throws UnsupportedEncodingException {
        if (searchResource != null) {
            searchResource = URLDecoder.decode(searchResource, "UTF-8");
        }
        return jcTimeGrpService.getJcTimeGroups(searchResource);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("jctimegroups")
    public ResponseEntity<ResponseMessage> saveJcTimeGroups(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<JcTimeGrp> jcTimeGrps = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<JcTimeGrp>>() {});

        jcTimeGrpService.saveJcTimeGroups(jcTimeGrps);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated JcTimeGrp entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("jctimegroups/delete")
    public ResponseEntity<ResponseMessage> deleteJcTimeGroups(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<JcTimeGrp> jcTimeGrps = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<JcTimeGrp>>() {});

        jcTimeGrpService.deleteJcTimeGroups(jcTimeGrps);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Deleted JcTimeGrp entities"), HttpStatus.OK);
    }
}
