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

public class HO_CO_ITEM_MSTController {

    private final QueryHandler queryHandler;

    // 일정 조회
    @PostMapping("/fp/co/HO_CO_ITEM_MST/q1")
    public List<Map<String, Object>> getData1(@RequestBody Map<String, Object> params, HttpServletRequest request) {

        Map<String, Object> param = new HashMap<>();
        param.put("P_ITEM_CD", params.get("P_ITEM_CD"));
        param.put("P_ITEM_TYPE", params.get("P_ITEM_TYPE"));
        param.put("P_DO_EX_SE", params.get("P_DO_EX_SE"));
        param.put("P_KEY_ITEM_YN", params.get("P_KEY_ITEM_YN"));
        param.put("P_USE_YN", params.get("P_USE_YN"));
		param.put("P_USER_ID", params.get("P_USER_ID"));
		param.put("P_VIEW_ID", "HO_CO_ITEM_MST");

        return queryHandler.getList("SP_HO_UI_ITEM_MST_Q01", param);
    }

    // 저장
    @PostMapping("/fp/co/HO_CO_ITEM_MST/s1")
    public Map<String, Object> saveData1(@RequestBody List<Map<String, Object>> changes, HttpServletRequest request) {
		Map<String, Object> resultMap = new HashMap<>();
		for (Map<String, Object> params : changes) {
			Map<String, Object> param = new HashMap<>();
            param.put("P_ITEM_CD", new Object[] { params.get("ITEM_CD"), String.class, ParameterMode.IN });
            param.put("P_ITEM_GRAD", new Object[] { params.get("ITEM_GRAD"), String.class, ParameterMode.IN });
            param.put("P_SESON_YN", new Object[] { params.get("SESON_YN"), String.class, ParameterMode.IN });
            param.put("P_KEY_ITEM_YN", new Object[] { params.get("KEY_ITEM_YN"), String.class, ParameterMode.IN });
            param.put("P_USE_YN", new Object[] { params.get("USE_YN"), String.class, ParameterMode.IN });
            param.put("P_USER_ID", new Object[] { params.get("P_USER_ID"), String.class, ParameterMode.IN });
            param.put("P_VIEW_ID", new Object[] { "HO_CO_ITEM_MST", String.class, ParameterMode.IN });

			Map<String, Object> result = queryHandler.save("SP_HO_UI_ITEM_MST_S01", param);
			resultMap.putAll(result);
		}
		return resultMap;
	}
}
