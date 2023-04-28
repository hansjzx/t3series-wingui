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

public class HO_CO_JCT_MSTController {

    private final QueryHandler queryHandler;

    // 일정 조회
    @PostMapping("/fp/co/HO_CO_JCT_MST/q1")
    public List<Map<String, Object>> getData1(@RequestBody Map<String, Object> params, HttpServletRequest request) {

        Map<String, Object> param = new HashMap<>();
		param.put("P_PLNT_CD", params.get("P_PLNT_CD"));
		param.put("P_RES_CD", params.get("P_RES_CD"));
		param.put("P_FR_ITEM_CD", params.get("P_FR_ITEM_CD"));
        param.put("P_TO_ITEM_CD", params.get("P_TO_ITEM_CD"));
		param.put("P_USER_ID", params.get("P_USER_ID"));
		param.put("P_VIEW_ID", "HO_CO_JCT_MST");

        return queryHandler.getList("SP_HO_UI_JCT_Q01", param);
    }

    // 저장
    @PostMapping("/fp/co/HO_CO_JCT_MST/s1")
    public Map<String, Object> saveData1(@RequestBody List<Map<String, Object>> changes, HttpServletRequest request) {
		Map<String, Object> resultMap = new HashMap<>();
		for (Map<String, Object> params : changes) {
			Map<String, Object> param = new HashMap<>();

            param.put("P_PLNT_CD", new Object[] { params.get("PLNT_CD"), String.class, ParameterMode.IN });
            param.put("P_RES_CD", new Object[] { params.get("RES_CD"), String.class, ParameterMode.IN });
            param.put("P_FR_ITEM_CD", new Object[] { params.get("FR_ITEM_CD"), String.class, ParameterMode.IN });
            param.put("P_TO_ITEM_CD", new Object[] { params.get("TO_ITEM_CD"), String.class, ParameterMode.IN });
            param.put("P_JCT", new Object[] { params.get("JCT"), Integer.class, ParameterMode.IN });
            param.put("P_USER_ID", new Object[] { params.get("P_USER_ID"), String.class, ParameterMode.IN });
            param.put("P_VIEW_ID", new Object[] { "HO_CO_JCT_MST", String.class, ParameterMode.IN });
            System.out.println(param);

			Map<String, Object> result = queryHandler.save("SP_HO_UI_JCT_S01", param);
			resultMap.putAll(result);
		}
		return resultMap;
	}
}
