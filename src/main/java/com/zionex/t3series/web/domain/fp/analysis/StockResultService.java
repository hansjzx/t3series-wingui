package com.zionex.t3series.web.domain.fp.analysis;

import com.zionex.t3series.web.domain.fp.stock.StockOutputPlanQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockResultService {
    
    private final StockOutputPlanQueryRepository stockOutputPlanQueryRepository;
    
    public List<StockOutputResult> getStockOutputs(String versionCd, List<String> plantCds) {
        List<StockOutputResult> stockOutputResults = stockOutputPlanQueryRepository.getStockOutputs(versionCd, plantCds);
        Map<String, Double> stockCdMap = stockOutputResults
                .stream()
                .collect(Collectors.groupingBy(StockOutputResult::getStockCd, Collectors.summingDouble(StockOutputResult::getUsedQty)));
        for (StockOutputResult stockOutputResult : stockOutputResults) {
            stockOutputResult.setIsPegging("Y".equals(stockOutputResult.getIsPegging()));
            double usedQtySum = stockCdMap.get(stockOutputResult.getStockCd());
            if (stockOutputResult.getUsableQty() != null) {
                stockOutputResult.setRemainQty(stockOutputResult.getUsableQty() - usedQtySum);
            }
        }        
        return stockOutputResults;
    }
    
}
