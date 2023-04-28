package com.zionex.t3series.web.domain.fp.pe;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.persistence.ParameterMode;
import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.util.interceptor.ExecPermission;
import com.zionex.t3series.web.util.query.QueryHandler;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor

public class HO_PE_DATA_VALIDController {

    private final QueryHandler queryHandler;
	
    // 일정 조회
    @PostMapping("/fp/pe/HO_PE_DATA_VALID/q1")
    public List<Map<String, Object>> getData1(@RequestBody Map<String, Object> params, HttpServletRequest request) {

        Map<String, Object> param = new HashMap<>();
		param.put("P_USER_ID", params.get("P_USER_ID"));
		param.put("P_VIEW_ID", "HO_PE_DATA_VALID");

        return queryHandler.getList("SP_HO_UI_DATA_VALID_Q01", param);
    }

    @PostMapping("/fp/pe/HO_PE_DATA_VALID/q2")
    public List<Map<String, Object>> getData2(@RequestBody Map<String, Object> params, HttpServletRequest request) {

        Map<String, Object> param = new HashMap<>();
		param.put("P_ERROR_CD", params.get("P_ERROR_CD"));
		param.put("P_USER_ID", params.get("P_USER_ID"));
		param.put("P_VIEW_ID", "HO_PE_DATA_VALID");

        return queryHandler.getList("SP_HO_UI_DATA_VALID_Q02", param);
    }
}
