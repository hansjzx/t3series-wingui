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
public class HOBL_FP_UI_PLNT_POPUP_Controller {

    private final QueryHandler queryHandler;
	
    // 일정 조회
    // @PostMapping("/fp/co/HOBL_FP_UI_PLNT_POPUP/q1")
    @RequestMapping("/fp/co/HOBL_FP_UI_PLNT_POPUP/q1")
    public List<Map<String, Object>> getData1(@RequestBody Map<String, Object> params, HttpServletRequest request) {

        Map<String, Object> param = new HashMap<>();
		param.put("P_USER_ID", params.get("P_USER_ID"));
		param.put("P_VIEW_ID", params.get("P_VIEW_ID"));

        return queryHandler.getList("SP_HO_UI_PLNT_POPUP_MST_Q01", param);
    }
}
