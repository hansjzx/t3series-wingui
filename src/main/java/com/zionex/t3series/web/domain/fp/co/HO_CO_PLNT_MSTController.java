package com.zionex.t3series.web.domain.fp.co;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.persistence.ParameterMode;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.util.query.QueryHandler;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor

public class HO_CO_PLNT_MSTController {

    private final QueryHandler queryHandler;

    // 조회
    @PostMapping("/fp/co/HO_CO_PLNT_MST/q1")
    public List<Map<String, Object>> getData1(@RequestBody Map<String, Object> params, HttpServletRequest request) {

        Map<String, Object> param = new HashMap<>();
        param.put("P_USER_ID", params.get("P_USER_ID"));
        param.put("P_VIEW_ID", "HO_CO_PLNT_MST");
        return queryHandler.getList("SP_HO_UI_PLNT_MST_Q01", params);
    }

    // 저장
    @PostMapping("/fp/co/HO_CO_PLNT_MST/s1")
    public Map<String, Object> saveData1(@RequestBody List<Map<String, Object>> changes, HttpServletRequest request) {
		Map<String, Object> resultMap = new HashMap<>();
		for (Map<String, Object> params : changes) {
			Map<String, Object> param = new HashMap<>();

			param.put("P_PLNT_CD", new Object[] { params.get("PLNT_CD"), String.class, ParameterMode.IN });
            param.put("P_PRDT_PLNT_YN", new Object[] {(Boolean) params.get("PRDT_PLNT_YN") ? "Y" : "N", String.class, ParameterMode.IN });
            param.put("P_USER_ID", new Object[] { params.get("USER_ID"), String.class, ParameterMode.IN });
            param.put("P_VIEW_ID", new Object[] { "HO_CO_PLNT_MST", String.class, ParameterMode.IN });

			Map<String, Object> result = queryHandler.save("SP_HO_UI_PLNT_MST_S01", param);
			resultMap.putAll(result);
		}
		return resultMap;
	}

}
