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

public class HO_CO_RES_MSTController {

    private final QueryHandler queryHandler;
	
    // 일정 조회
    @PostMapping("/fp/co/HO_CO_RES_MST/q1")
    public List<Map<String, Object>> getData1(@RequestBody Map<String, Object> params, HttpServletRequest request) {

        Map<String, Object> param = new HashMap<>();
		param.put("P_RES_CD", params.get("P_RES_CD"));
		param.put("P_PROC_DIV_01", params.get("P_PROC_DIV_01"));
		param.put("P_PROC_DIV_02", params.get("P_PROC_DIV_02"));
		param.put("P_USER_ID", params.get("P_USER_ID"));
		param.put("P_VIEW_ID", "HO_CO_RES_MST");

        return queryHandler.getList("SP_HO_UI_RES_MST_Q01", param);
    }

    // 저장
    @PostMapping("/fp/co/HO_CO_RES_MST/s1")
    public Map<String, Object> saveData1(@RequestBody List<Map<String, Object>> changes, HttpServletRequest request) {
		Map<String, Object> resultMap = new HashMap<>();
		for (Map<String, Object> params : changes) {
			Map<String, Object> param = new HashMap<>();
            param.put("P_RES_CD", new Object[] { params.get("RES_CD"), String.class, ParameterMode.IN });
            param.put("P_MAX_VOL", new Object[] { params.get("MAX_VOL"), String.class, ParameterMode.IN });
            param.put("P_MOQ_VOL", new Object[] { params.get("MOQ_VOL"), String.class, ParameterMode.IN });
            param.put("P_LINE_GRP_CD", new Object[] { params.get("LINE_GRP_CD"), String.class, ParameterMode.IN });
            param.put("P_USER_ID", new Object[] { params.get("P_USER_ID"), String.class, ParameterMode.IN });
            param.put("P_VIEW_ID", new Object[] { "HO_CO_RES_MST", String.class, ParameterMode.IN });

			Map<String, Object> result = queryHandler.save("SP_HO_UI_RES_MST_S01", param);
			resultMap.putAll(result);
		}
		return resultMap;
	}
}
