package com.zionex.t3series.web.domain.common;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.zionex.t3series.web.util.query.QueryHandler;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommonService {

    private final QueryHandler queryHandler;

    public List<Map<String, Object>> getData(String procedureName, Map<String, Object> inputParams) {
        return queryHandler.getList(procedureName, inputParams);
    }

    public Map<String, Object> saveData(String procedureName, Map<String, Object> inputParams) {
        return queryHandler.save(procedureName, inputParams);
    }

}
