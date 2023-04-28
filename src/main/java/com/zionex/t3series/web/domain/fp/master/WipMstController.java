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
import com.zionex.t3series.web.domain.fp.wip.Wip;
import com.zionex.t3series.web.domain.fp.wip.WipService;
import com.zionex.t3series.web.util.ResponseMessage;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/master/wip/")
public class WipMstController {

    private final WipService wipService;

    private final ObjectMapper objectMapper;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("wips")
    public List<Wip> getWips(@RequestParam("wip") String wipParam) throws UnsupportedEncodingException {
        if (wipParam != null) {
            wipParam = URLDecoder.decode(wipParam, "UTF-8");
        }

        return wipService.getWips(wipParam);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("wips")
    public ResponseEntity<ResponseMessage> saveResources(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<Wip> wips = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<Wip>>() {});

        wipService.saveWips(wips);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated wips entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("wips/delete")
    public ResponseEntity<ResponseMessage> deleteResources(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<Wip> wips = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<Wip>>() {});

        wipService.deleteWips(wips);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Deleted wips entities"), HttpStatus.OK);
    }

}
