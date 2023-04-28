package com.zionex.t3series.web.domain.fp.master;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.domain.fp.stock.Stock;
import com.zionex.t3series.web.domain.fp.stock.StockService;
import com.zionex.t3series.web.util.ResponseMessage;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/master/stock/")
public class StockMstController {

    private final StockService stockService;

    private final ObjectMapper objectMapper;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("stocks")
    public List<Stock> getStocks(@RequestParam("stock") String stockParam) throws UnsupportedEncodingException {
        if (stockParam != null) {
            stockParam = URLDecoder.decode(stockParam, "UTF-8");
        }

        return stockService.getStocksByStockCdAndDesc(stockParam);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("stocks")
    public ResponseEntity<ResponseMessage> saveResources(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<Stock> stocks = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<Stock>>() {});

        stockService.saveStocks(stocks);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated stock entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("stocks/delete")
    public ResponseEntity<ResponseMessage> deleteResources(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<Stock> stocks = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<Stock>>() {});

        stockService.deleteStocks(stocks);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Deleted stock entities"), HttpStatus.OK);
    }

}
