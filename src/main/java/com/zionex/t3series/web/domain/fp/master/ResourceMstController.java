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
import com.zionex.t3series.web.domain.fp.resource.Resource;
import com.zionex.t3series.web.domain.fp.resource.ResourceService;
import com.zionex.t3series.web.util.ResponseMessage;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/master/resource/")
public class ResourceMstController {

    private final ResourceService resourceService;

    private final ObjectMapper objectMapper;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("resources")
    public List<Resource> getResources(@RequestParam("resource") String resourceParam) throws UnsupportedEncodingException {
        if (resourceParam != null) {
            resourceParam = URLDecoder.decode(resourceParam, "UTF-8");
        }

        return resourceService.getResources(resourceParam);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("resources")
    public ResponseEntity<ResponseMessage> saveResources(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<Resource> resources = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<Resource>>() {});

        resourceService.saveResources(resources);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Updated resource entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("resources/delete")
    public ResponseEntity<ResponseMessage> deleteResources(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<Resource> resources = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<Resource>>() {});

        resourceService.deleteResources(resources);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Deleted resource entities"), HttpStatus.OK);
    }

}
