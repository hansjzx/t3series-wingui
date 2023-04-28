package com.zionex.t3series.web.domain.engine;

import static com.zionex.t3series.web.constant.ApplicationConstants.REQUEST_KEY_TREE_KEY_ID;
import static com.zionex.t3series.web.constant.ApplicationConstants.REQUEST_KEY_TREE_PARENT_ID;
import static com.zionex.t3series.web.constant.ServiceConstants.PARAMETER_KEY_COLUMNS_1;
import static com.zionex.t3series.web.constant.ServiceConstants.PARAMETER_KEY_INFO;
import static com.zionex.t3series.web.constant.ServiceConstants.PARAMETER_KEY_ITC1S_NAMES;
import static com.zionex.t3series.web.constant.ServiceConstants.PARAMETER_KEY_MAPDATA;
import static com.zionex.t3series.web.constant.ServiceConstants.PARAMETER_KEY_RESULT_CODE;
import static com.zionex.t3series.web.constant.ServiceConstants.PARAMETER_KEY_RESULT_DATA;
import static com.zionex.t3series.web.constant.ServiceConstants.PARAMETER_KEY_RESULT_MESSAGE;
import static com.zionex.t3series.web.constant.ServiceConstants.PARAMETER_KEY_RESULT_SUCCESS;
import static com.zionex.t3series.web.constant.ServiceConstants.PARAMETER_KEY_RESULT_TYPE;
import static com.zionex.t3series.web.constant.ServiceConstants.PARAMETER_KEY_TABLEDATA;
import static com.zionex.t3series.web.constant.ServiceConstants.RESULT_CODE_FAIL;
import static com.zionex.t3series.web.constant.ServiceConstants.RESULT_CODE_MISSING_MESSAGE;
import static com.zionex.t3series.web.constant.ServiceConstants.RESULT_CODE_SESSION_CLOSE;
import static com.zionex.t3series.web.constant.ServiceConstants.RESULT_KEY_IM_DATA;
import static com.zionex.t3series.web.constant.ServiceConstants.RESULT_KEY_ITC1_DATA;
import static com.zionex.t3series.web.constant.ServiceConstants.RESULT_TYPE_IM;
import static com.zionex.t3series.web.constant.ServiceConstants.RESULT_TYPE_IMTC_1;
import static com.zionex.t3series.web.constant.ServiceConstants.RESULT_TYPE_ITC_1;
import static com.zionex.t3series.web.constant.ServiceConstants.RESULT_TYPE_ITC_1S;
import static com.zionex.t3series.web.constant.ServiceConstants.RESULT_TYPE_ITC_2;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zionex.t3platform.message.MessageOperator;
import com.zionex.t3platform.message.MessageOperator.MessageType;
import com.zionex.t3series.util.ObjectUtil;
import com.zionex.t3series.util.time.TimeStamp;
import com.zionex.t3series.web.ApplicationProperties;
import com.zionex.t3series.web.ApplicationProperties.Server;
import com.zionex.t3series.web.security.authentication.AuthenticationInfo;
import com.zionex.t3series.web.security.authentication.AuthenticationManager;
import com.zionex.t3series.web.util.ResponseData;
import com.zionex.t3series.web.util.crosstab.Crosstab;
import com.zionex.t3series.web.util.crosstab.CrosstabBuilder;
import com.zionex.t3series.web.util.crosstab.CrosstabException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Servlet implementation class DataTest
 */
@Slf4j
@RestController
@RequiredArgsConstructor
public class EngineController extends ResponseData {

    public static final String ELEMENT_ITC1TO1 = "itc1to1";
    public static final String ELEMENT_ITC1TO2 = "itc1to2";

    public static final String PARAMETER_KEY_CROSSTAB = "CROSSTAB";
    public static final String PARAMETER_KEY_REVERSE_TARGERT = "REVERSE_TARGET";
    public static final String PARAMETER_KEY_OMIT_ROW = "OMIT_ROW";

    private final AuthenticationManager authenticationManager;
    private final EngineAdaptor engineAdaptor;
    private final ApplicationProperties applicationProperties;

    @PostMapping("/engine/service")
    public Map<String, Object> service(@RequestBody Map<String, Object> paramMap) {
        return engineAdaptor.doSyncService(paramMap);
    }

    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/engine/{target}/{service}", method = { RequestMethod.GET, RequestMethod.POST })
    public void doService(@PathVariable("target") String target, @PathVariable("service") String service, HttpServletRequest request, HttpServletResponse response) throws IOException {
        int timeout = ObjectUtil.toInteger(request.getParameter("timeout"), -1);

        log.info("Engine service request: target = {}, service = {}, timeout = {}", target, service, timeout);

        AuthenticationInfo authenticationInfo = authenticationManager.getAuthenticationInfo();
        if (authenticationInfo == null) {
            String message = "Session does not exist.";
            log.warn(message);
            responseError(response, message, RESULT_CODE_SESSION_CLOSE);
            return;
        }

        Map<String, Server> servers = applicationProperties.getServer();
        if (servers.containsKey(target)) {
            Server targetServer = servers.getOrDefault(target, null);
            if (targetServer != null) {
                target = targetServer.getId();
            }
        }

        Map<String, Object> params = getParameters(request);

        Map<String, Map<String, Object>> crossTabParam = (Map<String, Map<String, Object>>) params.get(PARAMETER_KEY_CROSSTAB);

        if (crossTabParam != null) {
            String reverseTargetId = (String) params.get(PARAMETER_KEY_REVERSE_TARGERT);
            if (!StringUtils.isEmpty(reverseTargetId) && params.containsKey(reverseTargetId)) {
                List<Map<String, Object>> reverseTargetData = (List<Map<String, Object>>) params.get(reverseTargetId);

                try {
                    if (crossTabParam.containsKey(ELEMENT_ITC1TO1)) {
                        Map<String, Object> itc1to1Params = crossTabParam.get(ELEMENT_ITC1TO1);
                        if (itc1to1Params.isEmpty()) {
                            throw new CrosstabException("There is no crosstab parameter for reverse.");
                        }

                        List<Map<String, Object>> newData = Crosstab.reverseToType1(reverseTargetData, itc1to1Params);

                        log.debug("### REVERSE RESULT: {}", newData.toString());
                        params.put(reverseTargetId, newData);
                    } else if (crossTabParam.containsKey(ELEMENT_ITC1TO2)) {
                        Map<String, Object> itc1to2Params = crossTabParam.get(ELEMENT_ITC1TO2);
                        if (itc1to2Params.isEmpty()) {
                            throw new CrosstabException("There is no crosstab parameter for reverse.");
                        }

                        List<Map<String, Object>> newData = Crosstab.reverseToType2(reverseTargetData, itc1to2Params);

                        log.debug("### REVERSE RESULT: {}", newData.toString());
                        params.put(reverseTargetId, newData);
                    }
                } catch (CrosstabException e) {
                    responseError(response, e.getMessage(), RESULT_CODE_FAIL);
                }
            }
        }

        log.info("Engine service start... (target = {}, service = {})", target, service);
        Map<String, Object> serviceResult = engineAdaptor.doSyncService(MessageOperator.makeMessage(MessageType.request.toString(), "T3WingUI", new String[] { target }, service, "", timeout, params));
        log.info("Engine service ended. (target = {}, service = {})", target, service);

        if (serviceResult == null) {
            String message = String.format("Engine service result is null. (target = %s, service = %s)", target, service);
            log.warn(message);
            responseError(response, message, RESULT_CODE_MISSING_MESSAGE);
            return;
        }

        if ("RestartServer".equals(service)) {
            JSONObject resultData = new JSONObject();
            resultData.put(PARAMETER_KEY_RESULT_SUCCESS, true);
            responseResult(response, resultData);
            return;
        }

        Map<String, Object> resultContents = (Map<String, Object>) serviceResult.get(MessageOperator.KEY_CONTENTS);
        if (resultContents == null) {
            String message = String.format("Service content is null. (target = %s, service = %s)", target, service);
            log.warn(message);
            responseError(response, message, RESULT_CODE_MISSING_MESSAGE);
            return;
        }

        Map<String, Object> serviceResultInfo = (Map<String, Object>) resultContents.get(PARAMETER_KEY_INFO);
        Object resultType = serviceResultInfo.get(PARAMETER_KEY_RESULT_TYPE);

        if (resultType == null) {
            String message = String.format("Engine service result type is null. (target = %s, service = %s)", target, service);
            log.warn(message);
            responseError(response, message, RESULT_CODE_FAIL);
            return;
        }

        log.info(String.format("Engine service result type is %s. (target = %s, service = %s)", resultType, target, service));

        boolean success = (boolean) serviceResultInfo.get(PARAMETER_KEY_RESULT_SUCCESS);
        String message = (String) serviceResultInfo.get(PARAMETER_KEY_RESULT_MESSAGE);
        String resultCode = (String) serviceResultInfo.get(PARAMETER_KEY_RESULT_CODE);

        if (!success) {
            log.warn("Engine service result has failed. (target = {}, service = {}, message = {})", target, service, message);
            responseError(response, message, resultCode);
            return;
        }

        if (crossTabParam != null) {
            try {
                if (crossTabParam.containsKey(ELEMENT_ITC1TO1)) {
                    resultContents = Crosstab.convertToType1(resultContents, crossTabParam.get(ELEMENT_ITC1TO1));
                } else if (crossTabParam.containsKey(ELEMENT_ITC1TO2)) {
                    Map<String, Object> itc1to2Params = crossTabParam.get(ELEMENT_ITC1TO2);
                    if (params.containsKey(PARAMETER_KEY_OMIT_ROW)) {
                        itc1to2Params.put(CrosstabBuilder.OMIT_ROW, params.get(PARAMETER_KEY_OMIT_ROW));
                    }

                    if (log.isDebugEnabled()) {
                        List<List<Object>> resultData = (List<List<Object>>) resultContents.get("TABLEDATA");
                        log.debug("Received data size : {}", resultData.size());

                        long start = System.currentTimeMillis();
                        TimeStamp startTime = new TimeStamp(start);
                        log.debug("Crosstab start.. : {}", startTime.toTimeString());
                    }

                    resultContents = Crosstab.convertToType2(resultContents, itc1to2Params);

                    if (log.isDebugEnabled()) {
                        long end = System.currentTimeMillis();
                        TimeStamp endTime = new TimeStamp(end);
                        log.debug("Crosstab ended. : {}", endTime.toTimeString());

                        List<List<Object>> finalData = (List<List<Object>>) resultContents.get("TABLEDATA");
                        log.debug("Final data size : {}", finalData.size());
                    }
                }
            } catch (CrosstabException e) {
                responseError(response, e.getMessage(), RESULT_CODE_FAIL);
            }
        }

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");

        JSONObject resultData = new JSONObject();
        resultData.put(PARAMETER_KEY_RESULT_SUCCESS, true);
        resultData.put(PARAMETER_KEY_RESULT_MESSAGE, message);
        resultData.put(PARAMETER_KEY_RESULT_CODE, resultCode);
        resultData.put(PARAMETER_KEY_RESULT_TYPE, resultType);

        switch (resultType.toString()) {
            case RESULT_TYPE_ITC_1:
            case RESULT_TYPE_ITC_2:
                makeResultITC1ITC2(resultContents, resultType, request, response, service, target, format, resultData);
                break;
            case RESULT_TYPE_IMTC_1:
                makeResultIMTC1(resultContents, request, response, service, target, format, resultData);
                break;
            case RESULT_TYPE_ITC_1S:
                makeResultITC1S(resultContents, response, service, target, format, resultData);
                break;
            case RESULT_TYPE_IM:
                makeResultIM(resultContents, format, resultData);
                break;
            default:    // RESULT_TYPE_I, RESULT_TYPE_ITCR_1, RESULT_TYPE_ITCR_2
                break;
        }

        responseResult(response, resultData);

        log.info("Engine service finished: target = {}, service = {}, timeout = {}", target, service, timeout);
    }

    private Map<String, Object> makeHierarchInfo(String parentId, Map<String, List<String>> parentChilds, int depth, HashMap<Integer, Set<String>> history) {
        Map<String, Object> childMap = new HashMap<>();

        int currentDepth = depth;
        List<String> children = parentChilds.get(parentId);
        if (children == null || children.isEmpty()) {
            return childMap;
        }

        Set<String> historyList = history.computeIfAbsent(currentDepth, key -> new HashSet<>());

        Set<String> r = history.entrySet().stream()
            .filter(x -> x.getKey() < currentDepth)
            .flatMap(p -> p.getValue().stream())
            .collect(Collectors.toSet());

        for (String childId : children) {
            if (parentId.equals(childId)) {
                continue;
            }

            if (!parentId.equals("root") && r.contains(childId)) {
                childMap.put(childId, new HashMap<>());
            } else {
                historyList.add(childId);
                childMap.put(childId, makeHierarchInfo(childId, parentChilds,depth+1, history));
            }
        }

        return childMap;
    }

    @SuppressWarnings("unchecked")
    private JSONArray makeJson(Map<String, Object> hierarchyInfo, Map<String, List<Object>> data, List<String> columnNames) {
        JSONArray jsonArray = new JSONArray();

        for (Map.Entry<String, Object> subEntry : hierarchyInfo.entrySet()) {
            String id = subEntry.getKey();
            Map<String, Object> inHierarchyInfo = (Map<String, Object>) subEntry.getValue();

            JSONObject jsonObj = new JSONObject();

            List<Object> row = data.get(id);
            for (int idx = 0; idx < columnNames.size(); idx++) {
                String columnName = columnNames.get(idx);
                Object value = row.get(idx);
                jsonObj.put(columnName, value);
            }

            jsonObj.put("expanded", "true");

            if (inHierarchyInfo != null && !inHierarchyInfo.isEmpty()) {
                jsonObj.put("items", makeJson(inHierarchyInfo, data, columnNames));
            }
            jsonArray.add(jsonObj);
        }
        return jsonArray;
    }

    @SuppressWarnings("unchecked")
    private void makeResultITC1ITC2(Map<String, Object> resultContents, Object resultType, HttpServletRequest request,
                                    HttpServletResponse response, String service, String target, SimpleDateFormat format, JSONObject resultData) {

        List<List<Object>> rows = (List<List<Object>>) resultContents.get(PARAMETER_KEY_TABLEDATA);
        List<String> columnNames = (List<String>) resultContents.get(PARAMETER_KEY_COLUMNS_1);

        if (resultType.equals(RESULT_TYPE_ITC_2)) {
            columnNames = new ArrayList<>();
            List<List<Object>> columnNames2 = (List<List<Object>>) resultContents.get(PARAMETER_KEY_COLUMNS_1);
            for (List<Object> each : columnNames2) {
                columnNames.add(each == null ? "" : each.toString());
            }
        }

        String treeParentId = request.getParameter(REQUEST_KEY_TREE_PARENT_ID);
        String treeKeyId = request.getParameter(REQUEST_KEY_TREE_KEY_ID);

        if (log.isDebugEnabled()) {
            log.debug("data size: {}, columns: {}", rows.size(), columnNames.toString());
        }

        int colCount = columnNames.size();
        if (StringUtils.isEmpty(treeParentId) && StringUtils.isEmpty(treeKeyId)) {
            JSONArray actualData = new JSONArray();
            makeActualData(response, service, target, format, rows, columnNames, colCount, actualData);
            resultData.put(PARAMETER_KEY_RESULT_DATA, actualData);

        } else {
            log.debug("Component Type is TREE");

            int childIdx = 0;
            int parentIdx = 0;

            for (int idx = 0; idx < colCount; idx++) {
                String columnName = columnNames.get(idx);
                if (columnName.equals(treeKeyId)) {
                    childIdx = idx;
                } else if (columnName.equals(treeParentId)) {
                    parentIdx = idx;
                }
            }

            Map<String, List<Object>> data = new HashMap<>();
            Map<String, List<String>> hiearchy = new HashMap<>();

            for (List<Object> row : rows) {
                if (log.isDebugEnabled()) {
                    log.debug("row: {}", row);
                }

                int idx = 0;
                for (Object value : row) {
                    if (value instanceof Date) {
                        row.set(idx, format.format(value));
                    }
                    idx++;
                }

                String childId = (String) row.get(childIdx);
                Object parent = row.get(parentIdx);
                String parentId = null;
                if (parent instanceof String) {
                    parentId = (String) parent;
                }

                if (StringUtils.isEmpty(parentId)) {
                    parentId = "root";
                }

                List<String> list = hiearchy.computeIfAbsent(parentId, k -> new ArrayList<>());
                list.add(childId);

                data.put(childId, row);
            }

            Map<String, Object> hiearchyinfo = makeHierarchInfo("root", hiearchy, 1, new HashMap<>());
            if (hiearchyinfo.size() > 0) {
                JSONArray makeJson = makeJson(hiearchyinfo, data, columnNames);
                resultData.put(PARAMETER_KEY_RESULT_DATA, makeJson);
            } else {
                JSONArray actualData = new JSONArray();
                makeActualData(response, service, target, format, rows, columnNames, colCount, actualData);
                resultData.put(PARAMETER_KEY_RESULT_DATA, actualData);
            }
        }
    }

    @SuppressWarnings("unchecked")
    private void makeActualData(HttpServletResponse response, String service, String target, SimpleDateFormat format, List<List<Object>> rows, List<String> columnNames, int colCount, JSONArray actualData) {
        for (List<Object> row : rows) {
            JSONObject jsonObj = new JSONObject();
            int idx = 0;
            if (row.size() != colCount) {
                responseError(response,
                        "call service fails [" + service + "#" + target + "] : column and data count is mismatch" + row.size() + "!=" + colCount,
                        RESULT_CODE_FAIL);
                return;
            }

            for (Object value : row) {
                if (value instanceof Date) {
                    jsonObj.put(columnNames.get(idx), format.format(value));
                } else {
                    jsonObj.put(columnNames.get(idx), value);
                }
                idx++;
            }
            actualData.add(jsonObj);
        }
    }

    @SuppressWarnings("unchecked")
    private void makeResultIMTC1(Map<String, Object> resultContents, HttpServletRequest request,
                                 HttpServletResponse response, String service, String target, SimpleDateFormat format,
                                 JSONObject resultData) {

        JSONObject resultDatas = new JSONObject();
        // IM
        Map<String, Object> mapData = (Map<String, Object>) resultContents.get(PARAMETER_KEY_MAPDATA);

        JSONObject mneoMapData = new JSONObject();
        makeMneoMapData(format, mapData, mneoMapData);
        resultDatas.put(RESULT_KEY_IM_DATA, mneoMapData);

        // ITC1
        List<List<Object>> rows = (List<List<Object>>) resultContents.get(PARAMETER_KEY_TABLEDATA);
        List<String> columnNames = (List<String>) resultContents.get(PARAMETER_KEY_COLUMNS_1);

        String treeParentId = request.getParameter(REQUEST_KEY_TREE_PARENT_ID);
        String treeKeyId = request.getParameter(REQUEST_KEY_TREE_KEY_ID);

        if (log.isDebugEnabled()) {
            log.debug("data size: {}, columns: {}", rows.size(), columnNames.toString());
        }

        int colCount = columnNames.size();
        if (StringUtils.isEmpty(treeParentId) && StringUtils.isEmpty(treeKeyId)) {
            JSONArray actualData = new JSONArray();
            makeActualData(response, service, target, format, rows, columnNames, colCount, actualData);
            resultDatas.put(RESULT_KEY_ITC1_DATA, actualData);
        } else {
            log.debug("Component Type is TREE");

            int childIdx = 0;
            int parentIdx = 0;

            for (int idx = 0; idx < colCount; idx++) {
                String columnName = columnNames.get(idx);
                if (columnName.equals(treeKeyId)) {
                    childIdx = idx;
                } else if (columnName.equals(treeParentId)) {
                    parentIdx = idx;
                }
            }

            Map<String, List<Object>> data = new HashMap<>();
            Map<String, List<String>> hiearchy = new HashMap<>();

            for (List<Object> row : rows) {
                if (log.isDebugEnabled()) {
                    log.debug("row: " + row);
                }

                int idx = 0;
                for (Object value : row) {
                    if (value instanceof Date) {
                        row.set(idx, format.format(value));
                    }
                    idx++;
                }

                String childId = (String) row.get(childIdx);
                String parentId = (String) row.get(parentIdx);

                if (StringUtils.isEmpty(parentId)) {
                    parentId = "root";
                }

                List<String> list = hiearchy.computeIfAbsent(parentId, k -> new ArrayList<>());
                list.add(childId);

                data.put(childId, row);
            }

            Map<String, Object> hiearchyinfo = makeHierarchInfo("root", hiearchy, 1, new HashMap<>());
            JSONArray makeJson = makeJson(hiearchyinfo, data, columnNames);
            resultDatas.put(RESULT_KEY_ITC1_DATA, makeJson);
        }
        resultData.put(PARAMETER_KEY_RESULT_DATA, resultDatas);

    }

    @SuppressWarnings("unchecked")
    private void makeResultIM(Map<String, Object> resultContents, SimpleDateFormat format, JSONObject resultData) {
        Map<String, Object> mapData = (Map<String, Object>) resultContents.get(PARAMETER_KEY_MAPDATA);
        JSONObject mneoMapData = new JSONObject();
        makeMneoMapData(format, mapData, mneoMapData);
        resultData.put(PARAMETER_KEY_RESULT_DATA, mneoMapData);

    }

    @SuppressWarnings("unchecked")
    private void makeMneoMapData(SimpleDateFormat format, Map<String, Object> mapData, JSONObject mneoMapData) {
        for (Map.Entry<String, Object> entry : mapData.entrySet()) {
            Object value = entry.getValue();
            if (value instanceof Date) {
                value = format.format(value);
            }

            mneoMapData.put(entry.getKey(), value);
        }
    }

    @SuppressWarnings("unchecked")
    private void makeResultITC1S(Map<String, Object> resultContents,
                                 HttpServletResponse response, String service, String target, SimpleDateFormat format,
                                 JSONObject resultData) {

        List<String> itc1sNames = (List<String>) resultContents.get(PARAMETER_KEY_ITC1S_NAMES);
        JSONObject resultDatas = new JSONObject();

        for (String itc1Name : itc1sNames) {
            Map<String, Object> resultDataMap = (Map<String, Object>) resultContents.get(itc1Name);

            List<List<Object>> rows = (List<List<Object>>) resultDataMap.get(PARAMETER_KEY_TABLEDATA);
            List<String> columnNames = (List<String>) resultDataMap.get(PARAMETER_KEY_COLUMNS_1);

            if (log.isDebugEnabled()) {
                log.debug("data size: {}, columns: {}", rows.size(), columnNames.toString());
            }

            int colCount = columnNames.size();
            JSONArray actualData = new JSONArray();
            makeActualData(response, service, target, format, rows, columnNames, colCount, actualData);
            resultDatas.put(itc1Name, actualData);
        }

        resultData.put(PARAMETER_KEY_RESULT_DATA, resultDatas);

    }

    private Map<String, Object> getParameters(HttpServletRequest request) {
        Map<String, Object> parameters = new HashMap<>();

        Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames.hasMoreElements()) {
            String parameterName = parameterNames.nextElement();

            String[] values = request.getParameterValues(parameterName);
            if (values == null || values.length == 0) {
                continue;
            }

            if (values.length == 1) {
                parameters.put(parameterName, marshall(values[0]));
            } else {
                List<Object> parameterValues = new ArrayList<>();
                for (String value : values) {
                    parameterValues.add(marshall(value));
                }
                parameters.put(parameterName, parameterValues);
            }
        }

        return parameters;
    }

    private Object marshall(String string) {
        try {
            if (string.startsWith("[")) {
                ObjectMapper mapper = new ObjectMapper();
                return mapper.readValue(string, new TypeReference<List<?>>() {
                });
            } else if (string.startsWith("{")) {
                ObjectMapper mapper = new ObjectMapper();
                return mapper.readValue(string, new TypeReference<Map<?, ?>>() {
                });
            }
        } catch (IOException e) {
            log.warn("JSON content deserialization failed.");
        }

        return string;
    }

}
