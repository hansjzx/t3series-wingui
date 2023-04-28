package com.zionex.t3series.web.domain.util.noticeboard;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class NoticeBoardController {

    private static final String SEARCH = "SEARCH";
    private static final String OPTION = "OPTION";
    private static final String PAGE = "PAGE";
    private static final String SIZE = "SIZE";

    private final NoticeBoardService noticeBoardService;

    private final ObjectMapper objectMapper;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("/noticeboard")
    public NoticeBoardResults getData(@RequestParam(SEARCH) String search, @RequestParam(OPTION) int option,
            @RequestParam(PAGE) int page, @RequestParam(SIZE) int size) {
        return noticeBoardService.getData(search, option, page, size);
    }

    @GetMapping("/noticeboard-home")
    public List<NoticeBoard> getCertain() {
        return noticeBoardService.getCertain();
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("/noticeboard")
    public void saveData(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final NoticeBoard notice = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<NoticeBoard>() {});

        noticeBoardService.saveData(notice);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("/noticeboard/delete")
    public void deleteData(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<NoticeBoard> notices = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<NoticeBoard>>() {});

        noticeBoardService.deleteData(notices);
    }

}
