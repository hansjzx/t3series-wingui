package com.zionex.t3series.web.util;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import lombok.extern.java.Log;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;

@Log
public class JsonUtil {

    public JsonUtil() {
    }

    // json 형식으로 유입된 HttpServletRequest를 JSONObject 형태로 return
    public JSONObject readJSONStringFromRequestBody(HttpServletRequest request) {
        StringBuffer json = new StringBuffer();
        String line = null;

        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null) {
                json.append(line);
            }
            JSONParser parser = new JSONParser();
            JSONObject jObj = (JSONObject) parser.parse(json.toString());
            return jObj;

        } catch (Exception e) {
            log.severe(e.getMessage());
        }
        return null;
    }

}
