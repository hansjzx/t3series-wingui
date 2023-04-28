package com.zionex.t3series.web.domain.bf.abcanalysis;

import java.util.List;
import java.util.Map;
import java.io.UnsupportedEncodingException;
import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.util.ResponseMessage;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/baselineforecast/master/")
public class ABCAnalysisController {

    private final ABCAnalysisService abcAnalysisService;
    private final SalesStatsService salesStatsService;

    private final ObjectMapper objectMapper;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("abcAnalysis")
    public ResponseEntity<ResponseMessage> saveItemAccountModelMap(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<ABCAnalysis> itemAccountMap = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<ABCAnalysis>>() {});
        
        abcAnalysisService.truncate();
        abcAnalysisService.saveItemAccountModelMap(itemAccountMap);
        return new ResponseEntity<ResponseMessage>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("getAbcXyzThld")
    public Map<String, Object> getAbcXyzThld() {
        return salesStatsService.selectDistinctThld();
    }
}