package com.zionex.t3series.web.domain.fp.co;

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

public class HO_CO_CUST_MSTController {

    private final QueryHandler queryHandler;

    // 일정 조회
    @PostMapping("/fp/co/HO_CO_CUST_MST/q1")
    public List<Map<String, Object>> getData1(@RequestBody Map<String, Object> params, HttpServletRequest request) {

        Map<String, Object> param = new HashMap<>();
        param.put("P_CUST_CD", params.get("P_CUST_CD"));
        param.put("P_DO_EX_SE", params.get("P_DO_EX_SE"));
		param.put("P_USER_ID", params.get("P_USER_ID"));
		param.put("P_VIEW_ID", "HO_CO_CUST_MST");

        return queryHandler.getList("SP_HO_UI_CUST_MST_Q01", param);
    }
}
