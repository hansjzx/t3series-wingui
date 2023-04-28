package com.zionex.t3series.web.domain.admin.code;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
public class CodeController {

    private final CodeService codeService;

    private final ObjectMapper objectMapper;
    
    @GetMapping("/system/common/codes")
    public List<Code> getCodesByGroupCd(@RequestParam(value = "group-cd", defaultValue = "") String groupCd) {
        return codeService.getCodesByGroupCd(groupCd);
    }

    @GetMapping("/system/common/code-name-maps")
    public List<Map<String, String>> getCodeNameByGroups(@RequestParam("group-cd") String groupCd) throws UnsupportedEncodingException {
        List<Map<String, String>> comnNameMaps = new ArrayList<>();

        groupCd = URLDecoder.decode(groupCd, "UTF-8");

        String[] groups = groupCd.split(",");
        Arrays.sort(groups);

        for (String group : groups) {
            List<Code> comnCodes = codeService.getCodesByGroupCd(group);

            comnCodes.forEach(comnCode -> {
                Map<String, String> comnNameMap = new HashMap<>();
                comnNameMap.put("group", group);
                comnNameMap.put("code", comnCode.getComnCd());
                comnNameMap.put("name", comnCode.getComnCdNm());
                comnNameMaps.add(comnNameMap);
            });
        }

        return comnNameMaps;
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("/system/common/codes/{src-id}")
    public List<Code> getCodes(@PathVariable("src-id") String srcId) {
        return codeService.getCodes(srcId);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("/system/common/codes")
    public ResponseEntity<ResponseMessage> saveCodes(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<Code> codes = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<Code>>() {});

        codeService.saveCodes(codes);
        return new ResponseEntity<ResponseMessage>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated common code entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("/system/common/codes/delete")
    public ResponseEntity<ResponseMessage> deleteCodes(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<Code> codes = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<Code>>() {});

        codeService.deleteCodes(codes);
        return new ResponseEntity<ResponseMessage>(new ResponseMessage(HttpStatus.OK.value(), "Deleted common code entities"), HttpStatus.OK);
    }

}
