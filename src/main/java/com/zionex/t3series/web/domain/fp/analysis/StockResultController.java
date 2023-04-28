package com.zionex.t3series.web.domain.fp.analysis;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/stock-result/")
public class StockResultController {
    
    private final StockResultService stockResultService;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("stock-outputs")
    public List<StockOutputResult> getStockOutputs(@RequestParam("version-cd") String versionCd, @RequestParam("plant-cds") List<String> plantCds) {
        return stockResultService.getStockOutputs(versionCd, plantCds);
    }
    
}
