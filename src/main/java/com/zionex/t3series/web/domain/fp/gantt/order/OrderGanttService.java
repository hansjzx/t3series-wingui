package com.zionex.t3series.web.domain.fp.gantt.order;

import com.zionex.t3series.web.domain.fp.activity.ActivityQueryRepository;
import com.zionex.t3series.web.util.converter.ColorConverter.ChartColor;
import com.zionex.t3series.web.domain.fp.gantt.resource.ActivityDetail;
import com.zionex.t3series.web.domain.fp.order.*;
import com.zionex.t3series.web.domain.fp.organization.Plant;
import com.zionex.t3series.web.domain.fp.organization.PlantService;
import com.zionex.t3series.web.domain.fp.result.OrderTrackingResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class OrderGanttService {

    private static final String DATETIME_PATTERN = "yyyy-MM-dd HH:mm:ss";
    private static final String STATUS_TP_CD = "PASS";

    private final WorkOrderService workOrderService;
    private final WoPlanService woPlanService;
    private final PlantService plantService;
    private final ActivityQueryRepository activityQueryRepository;
    private final WoPlanQueryRepository woPlanQueryRepository;

    public List<OrderGanttResult> getActivities(String versionCd, List<String> plantCds) {
        Map<String, String> workOrderMap = workOrderService.getWorkOrders()
                .stream()
                .collect(Collectors.toMap(WorkOrder::getWoCd, WorkOrder::getDisplayColor));
        List<WoPlan> woPlans = woPlanService.getWorkOrderPlans(versionCd, plantCds)
                .stream()
                .filter(woPlan -> STATUS_TP_CD.equals(woPlan.getPlanStatusTpCd()))
                .sorted(Comparator.comparing(WoPlan::getPlantCd).thenComparing(WoPlan::getWoCd))
                .collect(Collectors.toList());
        Map<String, List<OrderTrackingResult>> activityMap = activityQueryRepository.getActivitiesTree(versionCd, plantCds)
                .stream()
                .collect(Collectors.groupingBy(OrderTrackingResult::getWoCd, LinkedHashMap::new, Collectors.toList()));
        Map<String, String> plantMap = plantService.getPlants()
                .stream()
                .collect(Collectors.toMap(Plant::getPlantCd, Plant::getPlantNm));
        List<OrderGanttResult> ganttRows = new ArrayList<>();
        if (woPlans.isEmpty()) {
            return ganttRows;
        }

        String plant = woPlans.get(0).getPlantCd();
        int idx = 0;
        int startIdx = 0;
        int mergeRowCount = 0;
        for (WoPlan wo : woPlans) {
            String plantCd = wo.getPlantCd();
            String plantNm = plantMap.get(plantCd);
            String woCd = wo.getWoCd();
            List<OrderTrackingResult> activityWoGroup = activityMap.get(woCd);
            Map<String, List<OrderGanttResult>> parentMap = activityWoGroup
                    .stream()
                    .map(activity -> {
                                String mainCol = activity.getItemCd() + " (" + activity.getItemNm() + ")";
                                String displayColor = ChartColor.getColorString(activity.getDisplayColor());
                                return OrderGanttResult.builder().parent(activity.getParent()).tree(activity.getTree()).id(activity.getTree()).mainCol(mainCol)
                                        .woCd(woCd).plantCd(plantCd).plantNm(plantNm).activityId(activity.getTree()).itemCd(activity.getItemCd()).itemNm(activity.getItemNm())
                                        .itemUom(activity.getUom()).resourceCd(activity.getResourceCd()).qty(activity.getQty()).displayColor(displayColor)
                                        .startTs(formatDateTime(activity.getStartTs())).endTs(formatDateTime(activity.getEndTs())).build();
                            }
                    )
                    .collect(Collectors.groupingBy(OrderGanttResult::getParent, Collectors.toList()));

            String woBoxDisplayColor = ChartColor.getColorString(wo.getDisplayColor());
            String woCellDisplayColor = ChartColor.getColorString(workOrderMap.get(wo.getWoCd()));
            OrderGanttResult orderTree = OrderGanttResult.builder().tree(woCd).id(woCd).mainCol(woCd).woCd(woCd).plantCd(plantCd).plantNm(plantNm)
                    .itemCd(wo.getInventoryCd()).itemNm(wo.getInventoryNm()).itemUom(wo.getItemUom()).qty(wo.getShptQty()).displayColor(woBoxDisplayColor)
                    .startTs(formatDateTime(wo.getStartTs())).endTs(formatDateTime(wo.getEndTs())).dueDt(formatDateTime(wo.getDueDt())).mainColColor(woCellDisplayColor).build();
            makeTree(orderTree, parentMap);
            orderTree.setAnc(null);
            ganttRows.add(orderTree);

            if (plant != null && plant.equals(plantCd)) {
                idx += 1;
                mergeRowCount += 1;
            } else {
                ganttRows.get(startIdx).setPlantNmRowSpan(mergeRowCount + 0.5);
                plant = plantCd;
                mergeRowCount = 1;
                startIdx = idx;
                idx += 1;
            }
        }
        ganttRows.get(startIdx).setPlantNmRowSpan(mergeRowCount + 0.5);

        return ganttRows;
    }

    private void makeTree(OrderGanttResult row, Map<String, List<OrderGanttResult>> parentMap) {
        List<OrderGanttResult> childRows = parentMap.get(row.getTree());
        if (childRows != null) {
            row.setItems(childRows);
            StringBuilder anc = new StringBuilder();
            for (OrderGanttResult child : childRows) {
                anc.append(child.getId()).append(";");
                makeTree(child, parentMap);
            }
            row.setAnc(anc.toString());
        }
    }

    public ActivityDetail getWoTooltip(String versionCd, String plantCd, String woCd) {
        ActivityDetail woTooltip = woPlanQueryRepository.getWoTooltip(versionCd, plantCd, woCd);
        if (woTooltip != null) {
            long woTsDiffToSeconds = Duration.between(woTooltip.getWoStartTs(), woTooltip.getWoEndTs()).getSeconds();
            woTooltip.setWoTsDiff(splitSeconds(woTsDiffToSeconds));
        }
        return woTooltip;
    }

    public ActivityDetail getBomTooltip(String versionCd, String plantCd, String resourceCd, Long activityId) {
        ActivityDetail bomTooltip = activityQueryRepository.getWorkDetail(versionCd, plantCd, resourceCd, activityId);
        if (bomTooltip != null) {
            long tsDiffToSeconds = Duration.between(bomTooltip.getStartTs(), bomTooltip.getEndTs()).getSeconds();
            bomTooltip.setTsDiff(splitSeconds(tsDiffToSeconds));
        }
        return bomTooltip;
    }

    private String formatDateTime(LocalDateTime datetime) {
        return datetime.format(DateTimeFormatter.ofPattern(DATETIME_PATTERN));
    }

    private String splitSeconds(long diffToSeconds) {
        long hours = diffToSeconds / 3600;
        long minutes = (diffToSeconds % 3600) < 60 ? 0 : diffToSeconds % 3600 / 60;
        long seconds = diffToSeconds % 3600 % 60;
        return hours + "시간 " + minutes + "분 " + seconds + "초";
    }

}
