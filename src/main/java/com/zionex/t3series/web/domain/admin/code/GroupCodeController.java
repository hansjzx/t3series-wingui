package com.zionex.t3series.web.domain.admin.code;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
public class GroupCodeController {

    private final GroupCodeService groupCodeService;

    private final ObjectMapper objectMapper;
    
    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("/system/common/groups")
    public List<GroupCode> getGroupCodes(@RequestParam(value = "group-cd", defaultValue = "") String groupCd, @RequestParam(value = "group-nm", defaultValue = "") String groupNm) {
        return groupCodeService.getGroupCodes(groupCd, groupNm);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("/system/common/groups")
    public ResponseEntity<ResponseMessage> saveGroupCodes(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<GroupCode> groupCodes = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<GroupCode>>() {});

        groupCodeService.saveGroupCodes(groupCodes);
        return new ResponseEntity<ResponseMessage>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated common group entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("/system/common/groups/delete")
    public ResponseEntity<ResponseMessage> deleteGroupCodes(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<GroupCode> groupCodes = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<GroupCode>>() {});

        groupCodeService.deleteGroupCodes(groupCodes);
        return new ResponseEntity<ResponseMessage>(new ResponseMessage(HttpStatus.OK.value(), "Deleted common group entities"), HttpStatus.OK);
    }

}
