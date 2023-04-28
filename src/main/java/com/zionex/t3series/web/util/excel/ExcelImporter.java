package com.zionex.t3series.web.util.excel;

import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public interface ExcelImporter {

    Map<String, Object> handle(HttpServletRequest request, List<Map<String, Object>> resultData);

}
