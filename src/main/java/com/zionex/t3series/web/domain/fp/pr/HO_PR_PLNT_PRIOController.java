package com.zionex.t3series.web.domain.fp.pr;

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

public class HO_PR_PLNT_PRIOController {

    private final QueryHandler queryHandler;
	
    // 일정 조회
    @PostMapping("/fp/pr/HO_PR_PLNT_PRIO/q1")
    public List<Map<String, Object>> getData1(@RequestBody Map<String, Object> params, HttpServletRequest request) {

        Map<String, Object> param = new HashMap<>();
		param.put("P_ITEM_CD", params.get("P_ITEM_CD"));
		param.put("P_PLNT_CD", params.get("P_PLNT_CD"));
        param.put("P_PROD_YN", params.get("P_PROD_YN"));
		param.put("P_USER_ID", params.get("P_USER_ID"));
		param.put("P_VIEW_ID", "HO_PR_PLNT_PRIO");

        return queryHandler.getList("SP_HO_UI_PLNT_PRTY_Q01", param);
    }
}
