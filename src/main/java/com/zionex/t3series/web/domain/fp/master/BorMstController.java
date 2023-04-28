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
import com.zionex.t3series.web.domain.fp.bor.Bor;
import com.zionex.t3series.web.domain.fp.bor.BorSetDtl;
import com.zionex.t3series.web.domain.fp.bor.ToolSupply;
import com.zionex.t3series.web.domain.fp.bor.ToolSupplyService;
import com.zionex.t3series.web.domain.fp.resource.Resource;
import com.zionex.t3series.web.domain.fp.resource.ResourceService;
import com.zionex.t3series.web.util.ResponseMessage;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/master/bor/")
public class BorMstController {

    private final BorMstService borMstService;

    private final ResourceService resourceService;

    private final ToolSupplyService toolSupplyService;

    private final ObjectMapper objectMapper;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("bors")
    public List<BorMaster> getBors(@RequestParam(value = "searchItem", required = false) String searchItem,
                                   @RequestParam(value = "searchRoute", required = false) String searchRoute,
                                   @RequestParam(value = "searchResource", required = false) String searchResource) throws UnsupportedEncodingException {
        if (searchItem != null) {
            searchItem = URLDecoder.decode(searchItem, "UTF-8");
        }
        if (searchRoute != null) {
            searchRoute = URLDecoder.decode(searchRoute, "UTF-8");
        }
        if (searchResource != null) {
            searchResource = URLDecoder.decode(searchResource, "UTF-8");
        }

        return borMstService.getBors(searchItem, searchRoute, searchResource);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("borresources")
    public List<Bor> getBorResources(@RequestParam(value = "searchRouteCode", required = false) String searchRouteCode) throws UnsupportedEncodingException {
        if (searchRouteCode != null) {
            searchRouteCode = URLDecoder.decode(searchRouteCode, "UTF-8");
        }

        return borMstService.getBorResources(searchRouteCode);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("borsets")
    public List<BorSetDtl> getBorSets(@RequestParam(value = "searchRouteCode", required = false) String searchRouteCode) throws UnsupportedEncodingException {
        if (searchRouteCode != null) {
            searchRouteCode = URLDecoder.decode(searchRouteCode, "UTF-8");
        }

        return borMstService.getBorSets(searchRouteCode);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("borsettools")
    public List<ToolSettingMaster> getBorSetTools(@RequestParam(value = "searchResource", required = false) String searchResource,
                                         @RequestParam(value = "searchRoute", required = false) String searchRoute) throws UnsupportedEncodingException {
        if (searchRoute != null) {
            searchRoute = URLDecoder.decode(searchRoute, "UTF-8");
        }

        if (searchResource != null) {
            searchResource = URLDecoder.decode(searchResource, "UTF-8");
        }

        return borMstService.getBorSetTools(searchRoute, searchResource);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("tools")
    public List<Resource> getTools(@RequestParam(value = "searchResource", required = false) String searchResource) throws UnsupportedEncodingException {
        if (searchResource != null) {
            searchResource = URLDecoder.decode(searchResource, "UTF-8");
        }

        return resourceService.getToolResources(searchResource);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("borsets")
    public ResponseEntity<ResponseMessage> saveBorSets(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<Bor> bors = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<Bor>>() {});

        borMstService.saveBorSets(bors);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated item entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("bors")
    public ResponseEntity<ResponseMessage> saveBors(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<BorMaster> borMasters = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<BorMaster>>() {});

        borMstService.saveBors(borMasters);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated item entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("borsettools")
    public ResponseEntity<ResponseMessage> saveBorSetTools(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<ToolSettingMaster> toolSettingMasters = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<ToolSettingMaster>>() {});

        borMstService.saveBorSetTools(toolSettingMasters);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated item entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("bors/delete")
    public ResponseEntity<ResponseMessage> deleteBors(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<BorMaster> borMasters = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<BorMaster>>() {});
        
        borMstService.deleteBors(borMasters);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Deleted item entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("borsets/delete")
    public ResponseEntity<ResponseMessage> deleteBorSets(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<BorSetDtl> borSetDtls = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<BorSetDtl>>() {});
        
        borMstService.deleteBorSets(borSetDtls);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Deleted item entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("borsettools/delete")
    public ResponseEntity<ResponseMessage> deleteBorSetTools(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<ToolSettingMaster> toolSettingMasters = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<ToolSettingMaster>>() {});
        
        borMstService.deleteBorSetTools(toolSettingMasters);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Deleted item entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("toolsupplies")
    public List<ToolSupply> getToolSupplies(@RequestParam(value = "searchResource", required = false) String searchResource) throws UnsupportedEncodingException {
        if (searchResource != null) {
            searchResource = URLDecoder.decode(searchResource, "UTF-8");
        }

        return toolSupplyService.getToolSupplies(searchResource);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("toolsupplies")
    public ResponseEntity<ResponseMessage> saveToolSupplies(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<ToolSupply> toolSupplies = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA), new TypeReference<List<ToolSupply>>() {});

        toolSupplyService.saveToolSupplies(toolSupplies);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated ToolSupply entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("toolsupplies/delete")
    public ResponseEntity<ResponseMessage> deleteToolSupplies(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<ToolSupply> toolSupplies = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<ToolSupply>>() {});
        
        toolSupplyService.deleteToolSupplies(toolSupplies);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Deleted item entities"), HttpStatus.OK);
    }

}
