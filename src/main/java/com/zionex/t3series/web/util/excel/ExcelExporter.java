package com.zionex.t3series.web.util.excel;

import javax.servlet.http.HttpServletRequest;
import org.json.simple.JSONObject;

public interface ExcelExporter {

    ExcelContext handle(String fileName, JSONObject params, HttpServletRequest request);

}
