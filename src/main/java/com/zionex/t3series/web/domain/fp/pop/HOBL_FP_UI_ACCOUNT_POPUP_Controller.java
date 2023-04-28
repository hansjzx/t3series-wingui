package com.zionex.t3series.web.domain.fp.pop;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.persistence.ParameterMode;
import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.util.interceptor.ExecPermission;
import com.zionex.t3series.web.util.query.QueryHandler;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class HOBL_FP_UI_ACCOUNT_POPUP_Controller {

    private final QueryHandler queryHandler;
    // 거래처 조회
    @RequestMapping("/fp/pop/HOBL_FP_UI_ACCOUNT_POPUP/q1")
    public List<Map<String, Object>> getData1(@RequestBody Map<String, Object> params, HttpServletRequest request) {

        Map<String, Object> param = new HashMap<>();
		param.put("P_CUST_CD", params.get("P_CUST_CD"));
		param.put("P_DO_EX_SE", params.get("P_DO_EX_SE"));
		param.put("P_USER_ID", params.get("P_USER_ID"));
		param.put("P_VIEW_ID", params.get("P_VIEW_ID"));

        return queryHandler.getList("SP_HO_UI_CUST_POPUP_MST_Q01", param);
    }
}
