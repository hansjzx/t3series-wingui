package com.zionex.t3series.web.domain.admin.file;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zionex.t3series.web.ApplicationProperties;
import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.util.BeanUtil;
import com.zionex.t3series.web.util.JsonUtil;
import com.zionex.t3series.web.util.ResponseData;
import com.zionex.t3series.web.util.excel.ExcelContext;
import com.zionex.t3series.web.util.excel.ExcelConverter;
import com.zionex.t3series.web.util.excel.ExcelExporter;
import com.zionex.t3series.web.util.excel.ExcelImporter;

import lombok.extern.java.Log;

@Log
@RestController
public class ExcelController extends ResponseData {

    private final ApplicationProperties.Service.File fileProps;

    @Autowired
    public ExcelController(ApplicationProperties applicationProperties) {
        this.fileProps = applicationProperties.getService().getFile();
    }

    @RequestMapping(value = "/excel-import", method = { RequestMethod.POST, RequestMethod.GET })
    public void importExcel(@RequestParam("file") MultipartFile file, HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String externalPath = fileProps.getExternalPath();
            String uploadPath = externalPath + fileProps.getName() + "/" + fileProps.getCategory().getExcel();
    
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String fileName = file.getOriginalFilename();
            int index = fileName.replaceAll("\\\\", "/").lastIndexOf("/");
            fileName = fileName.substring(index + 1);

            String location = uploadPath + File.separator + fileName;
            File excel = new File(location);

            byte[] data = file.getBytes();
            FileOutputStream out = new FileOutputStream(location);
            out.write(data);
            out.close();

            String json = new ExcelConverter().toJson(excel);

            if (json.length() > 2) {
                responseResult(response, json);
            } else if (json.isEmpty()) {
                responseError(response, "Not suppported file type.");
            } else {
                responseError(response, "No data imported.");
            }

            excel.delete();
        } catch (Exception e) {
            e.printStackTrace();
            log.warning(e.getMessage());
            responseError(response, e.getMessage());
        }
    }

    @PostMapping("/excel-export")
    protected void exportExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String fileName = request.getParameter("fileName");
        String data = request.getParameter("data");
        Decoder decoder = Base64.getDecoder();
        log.warning(fileName);

        if (data.length() > 0) {
            // Decode
            byte[] filedata = decoder.decode(data);

            // Response Header
            fileName = StringUtils.cleanPath(fileName.replaceAll("\r", "").replaceAll("\n", "")).replaceAll("../", "");
            response.addHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
            response.addHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.addHeader("Pragma", "no-cache");

            // Write
            OutputStream os = response.getOutputStream();
            os.write(filedata);
            os.flush();
        }
    }

    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/large-excel-import/{handler}", method = { RequestMethod.POST, RequestMethod.GET })
    public void largeImportExcel(@PathVariable("handler") String handler, @RequestParam("file") MultipartFile file,
            HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String fileName = file.getOriginalFilename();
            byte[] data = file.getBytes();

            Map<String, Object> resultMap = new ExcelConverter().toListFromBytes(fileName, data);
            List<Map<String, Object>> resultData = (List<Map<String, Object>>) resultMap.get(ServiceConstants.PARAMETER_KEY_RESULT_DATA);

            if (resultData.isEmpty()) {
                responseError(response, "Not suppported file type.");
                return;
            }

            Object service = BeanUtil.getBean(handler);
            if (service != null && service instanceof ExcelImporter) {
                ExcelImporter importer = (ExcelImporter) service;

                Map<String, Object> result = importer.handle(request, resultData);
                if ((Boolean) result.get("result") == true) {
                    responseResult(response, resultData);
                } else {
                    responseError(response, result.get("msg").toString());
                }
            } else {
                responseError(response, "excel import handler not found.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.warning("import excel fails");
            responseError(response, e.getMessage());
        }
    }

    @PostMapping("/large-excel-export/{handler}")
    protected void largeExportExcel(@PathVariable("handler") String handler, HttpServletRequest request, HttpServletResponse response) throws IOException {
        JsonUtil jsonUtil = new JsonUtil();
        JSONObject params = jsonUtil.readJSONStringFromRequestBody(request);

        String fileName = handler;
        if (params != null) {
            fileName = (String) params.get("fileName");
        }

        Object service = BeanUtil.getBean(handler);
        if (service != null && service instanceof ExcelExporter) {
            ExcelExporter exporter = (ExcelExporter) service;
            ExcelContext excel = exporter.handle(fileName, params, request);

            if (excel != null) {
                fileName = StringUtils.cleanPath(fileName.replaceAll("\r", "").replaceAll("\n", "")).replaceAll("../","");
                response.addHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
                response.addHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                response.addHeader("X-Suggested-Filename", fileName);
                response.addHeader("Pragma", "no-cache");

                OutputStream os = response.getOutputStream();
                excel.write(os);
                os.flush();
            }
        } else {
            responseError(response, "excel export handler not found.");
        }

    }

}
