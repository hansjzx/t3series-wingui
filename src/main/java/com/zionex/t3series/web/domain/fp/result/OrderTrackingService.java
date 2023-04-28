package com.zionex.t3series.web.domain.fp.result;

import com.zionex.t3series.web.domain.fp.activity.ActivityQueryRepository;
import com.zionex.t3series.web.domain.fp.order.WoPlan;
import com.zionex.t3series.web.domain.fp.order.WoPlanService;
import com.zionex.t3series.web.domain.fp.stock.StockOutputPlanQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.Collections;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderTrackingService {

    private final WoPlanService woPlanService;
    private final ActivityQueryRepository activityQueryRepository;
    private final StockOutputPlanQueryRepository stockOutputPlanQueryRepository;

    public List<OrderTrackingResult> getOrdersTree(String versionCd, List<String> plantCds) {
        Map<String, List<WoPlan>> woMap = woPlanService.getWorkOrderPlans(versionCd, plantCds)
                .stream()
                .sorted(Comparator.comparing(WoPlan::getPlantCd).thenComparing(WoPlan::getWoCd))
                .collect(Collectors.groupingBy(WoPlan::getPlantCd, LinkedHashMap::new, Collectors.toList()));
        Map<String, List<OrderTrackingResult>> activityMap = activityQueryRepository.getActivitiesTree(versionCd, plantCds)
                .stream()
                .collect(Collectors.groupingBy(OrderTrackingResult::getWoCd, LinkedHashMap::new, Collectors.toList()));
        Map<String, List<OrderTrackingResult>> stockMap = stockOutputPlanQueryRepository.getStocksTree(versionCd, plantCds)
                .stream()
                .collect(Collectors.groupingBy(OrderTrackingResult::getWoCd, LinkedHashMap::new, Collectors.toList()));
        List<OrderTrackingResult> rows = new ArrayList<>();
        if (woMap.isEmpty()) {
            return rows;
        }

        for (String plantCd : woMap.keySet()) {
            OrderTrackingResult plantTree = OrderTrackingResult.builder().mainCol(plantCd).rows(new ArrayList<>()).build();
            List<WoPlan> woPlantGroup = woMap.get(plantCd);

            for (WoPlan wo : woPlantGroup) {
                List<OrderTrackingResult> activityWoGroup = activityMap.get(wo.getWoCd());
                if (stockMap.containsKey(wo.getWoCd())) {
                    activityWoGroup.addAll(stockMap.get(wo.getWoCd()));
                }
                Map<String, List<OrderTrackingResult>> parentMap = activityWoGroup
                        .stream()
                        .collect(Collectors.groupingBy(OrderTrackingResult::getParent, Collectors.toList()));
                OrderTrackingResult woTree = OrderTrackingResult.builder().mainCol(wo.getWoCd()).startTs(wo.getStartTs()).endTs(wo.getEndTs())
                        .dueDt(wo.getDueDt()).tree(wo.getWoCd()).build();
                makeTree(woTree, parentMap);
                plantTree.addRows(Collections.singletonList(woTree));
            }

            rows.add(plantTree);
        }

        return rows;
    }

    private void makeTree(OrderTrackingResult row, Map<String, List<OrderTrackingResult>> parentMap) {
        List<OrderTrackingResult> childRows = parentMap.get(row.getTree());
        if (childRows != null) {
            row.setRows(childRows);
            childRows.forEach(child -> {
                child.setMainCol(child.getItemCd() + " (" + child.getItemNm() + ")");
                makeTree(child, parentMap);
            });
        }
    }

}
