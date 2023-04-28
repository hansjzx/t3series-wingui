package com.zionex.t3series.web.domain.fp.master;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.domain.fp.bom.BomRoutingService;
import com.zionex.t3series.web.domain.fp.item.Item;
import com.zionex.t3series.web.domain.fp.item.ItemService;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/master/bom/")
public class BomMstController {
    
    private final ItemService itemService;
    
    private final BomRoutingService bomRoutingService;

    @GetMapping("items/product")
    public List<Item> getItems(@RequestParam(value = "search", required = false) String search) throws UnsupportedEncodingException {
        if (search != null) {
            search = URLDecoder.decode(search, "UTF-8");
        }

        return itemService.getProducts(search);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("bomtree")
    public List<Map<String, Object>> getBomTree(@RequestParam(value = "search", required = false) String search) throws UnsupportedEncodingException {
        if (search != null) {
            search = URLDecoder.decode(search, "UTF-8");
        }

        return bomRoutingService.getBomTreeTopDown(search);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("bomtree/reverse")
    public List<Map<String, Object>> getBomTreeReverse(@RequestParam(value = "search") String search) throws UnsupportedEncodingException {
        if (search != null) {
            search = URLDecoder.decode(search, "UTF-8");
        }

        return bomRoutingService.getBomTreeBottomUp(search);
    }

}
