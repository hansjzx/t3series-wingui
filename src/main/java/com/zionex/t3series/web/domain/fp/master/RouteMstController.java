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
import com.zionex.t3series.web.domain.fp.route.Route;
import com.zionex.t3series.web.domain.fp.route.RouteGrp;
import com.zionex.t3series.web.domain.fp.route.RouteGrpService;
import com.zionex.t3series.web.domain.fp.route.RouteService;
import com.zionex.t3series.web.util.ResponseMessage;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/master/route/")
public class RouteMstController {
    
    private final RouteService routeService;

    private final RouteGrpService routeGrpService;

    private final ObjectMapper objectMapper;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("routes")
    public List<Route> getRoutes(@RequestParam(value = "route", required = false) String routeParam) throws UnsupportedEncodingException {
        if (routeParam != null) {
            routeParam = URLDecoder.decode(routeParam, "UTF-8");
        }

        return routeService.getRoutes(routeParam);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("routes/delete")
    public ResponseEntity<ResponseMessage> deleteRoutes(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<Route> routes = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<Route>>() {});

        routeService.deleteRoutes(routes);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Deleted route entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("routes")
    public ResponseEntity<ResponseMessage> saveRoutes(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<Route> routes = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<Route>>() {});

        routeService.saveRoutes(routes);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated route entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("routegroups")
    public List<RouteGrp> getRouteGroups(@RequestParam(value = "search", required = false) String param) throws UnsupportedEncodingException {
        if (param != null) {
            param = URLDecoder.decode(param, "UTF-8");
        }

        return routeGrpService.getRouteGroups(param);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("routegroups/delete")
    public ResponseEntity<ResponseMessage> deleteRouteGroups(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<RouteGrp> routeGroups = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<RouteGrp>>() {});

        routeGrpService.deleteRouteGroups(routeGroups);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Deleted routegroups entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("routegroups")
    public ResponseEntity<ResponseMessage> saveRouteGroups(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<RouteGrp> routeGroups = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<RouteGrp>>() {});

        routeGrpService.saveRouteGroups(routeGroups);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated routegroups entities"), HttpStatus.OK);
    }
}
