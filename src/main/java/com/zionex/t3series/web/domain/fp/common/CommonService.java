package com.zionex.t3series.web.domain.fp.common;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.zionex.t3series.util.NetworkUtil;
import com.zionex.t3series.web.ApplicationProperties;
import com.zionex.t3series.web.ApplicationProperties.Server;
import com.zionex.t3series.web.domain.fp.order.SalesOrder;
import com.zionex.t3series.web.domain.fp.order.SalesOrderService;
import com.zionex.t3series.web.domain.fp.order.WorkOrder;
import com.zionex.t3series.web.domain.fp.order.WorkOrderService;
import com.zionex.t3series.web.domain.fp.organization.CorporationService;
import com.zionex.t3series.web.domain.fp.organization.Plant;
import com.zionex.t3series.web.domain.fp.organization.PlantService;
import com.zionex.t3series.web.domain.fp.organization.Site;
import com.zionex.t3series.web.domain.fp.organization.SiteService;
import com.zionex.t3series.web.domain.fp.organization.Stage;
import com.zionex.t3series.web.domain.fp.organization.StageService;
import com.zionex.t3series.web.domain.fp.plan.MainVersion;
import com.zionex.t3series.web.domain.fp.plan.MainVersionService;
import com.zionex.t3series.web.domain.fp.plan.PlanVersion;
import com.zionex.t3series.web.domain.fp.plan.PlanVersionService;
import com.zionex.t3series.web.domain.fp.plan.VersionPlant;
import com.zionex.t3series.web.domain.fp.plan.VersionPlantService;
import com.zionex.t3simpleserver.common.ConfigurationConstants;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service("fpCommonService")
@RequiredArgsConstructor
public class CommonService {

    private final MainVersionService mainVersionService;

    private final PlanVersionService planVersionService;

    private final VersionPlantService versionPlantService;

    private final CorporationService corporationService;

    private final SiteService siteService;

    private final PlantService plantService;

    private final StageService stageService;

    private final SalesOrderService salesOrderService;

    private final WorkOrderService workOrderService;

    private final ApplicationProperties applicationProperties;

    private static final String DATE_PATTERN = "yyyyMMdd";

    public List<PlanVersion> getVersions(String planningDate) {
        if (StringUtils.isNotEmpty(planningDate)) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_PATTERN);
            LocalDate planningDateToLocalDate = LocalDate.parse(planningDate, formatter);
            List<PlanVersion> planVersions = planVersionService.getPlanVersionsByPlanDt(planningDateToLocalDate);
            Map<String, Long> mainVersionMap = mainVersionService.getMainVersionsByPlanDt(planningDateToLocalDate)
                    .stream()
                    .collect(Collectors.toMap(MainVersion::getMainVersionCd, MainVersion::getVersionSeq));

            planVersions.forEach(pv -> pv.setPlants(getVersionPlants(pv.getVersionCd())));
            planVersions.sort(Comparator.comparing(PlanVersion::getMainVersionCd, Comparator.comparing(mainVersionMap::get, Comparator.nullsLast(Comparator.reverseOrder())))
                    .thenComparing(PlanVersion::getVersionSeq, Comparator.reverseOrder()));
            return planVersions;
        } else {
            return null;
        }
    }

    public List<Plant> getVersionPlants(String versionCd) {
        List<VersionPlant> versionPlants = versionPlantService.getVersionPlantsByVersion(versionCd);
        return versionPlants
                .stream()
                .map(VersionPlant::getPlant)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getStagesTree() {
        List<Map<String, Object>> rows = corporationService.getCorporations()
                .stream()
                .map(corporation -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("organization", "corporation");
                    row.put("code", corporation.getCorporationCd());
                    row.put("name", corporation.getCorporationNm());
                    row.put("description", corporation.getDescTxt());
                    return row;
                })
                .collect(Collectors.toList());
        Map<String, List<Map<String, Object>>> siteMap = siteService.getSites()
                .stream()
                .collect(Collectors.groupingBy(Site::getCorporationCd,
                        Collectors.mapping(site -> {
                            Map<String, Object> row = new HashMap<>();
                            row.put("organization", "site");
                            row.put("code", site.getSiteCd());
                            row.put("name", site.getSiteNm());
                            row.put("description", site.getDescTxt());
                            return row;
                        }, Collectors.toList())));
        Map<String, List<Map<String, Object>>> plantMap = plantService.getPlants()
                .stream()
                .collect(Collectors.groupingBy(Plant::getSiteCd,
                        Collectors.mapping(plant -> {
                            Map<String, Object> row = new HashMap<>();
                            row.put("organization", "plant");
                            row.put("code", plant.getPlantCd());
                            row.put("name", plant.getPlantNm());
                            row.put("description", plant.getDescripText());
                            return row;
                        }, Collectors.toList())));
        Map<String, List<Map<String, Object>>> stageMap = stageService.getStages()
                .stream()
                .collect(Collectors.groupingBy(Stage::getPlantCode,
                        Collectors.mapping(stage -> {
                            Map<String, Object> row = new HashMap<>();
                            row.put("organization", "stage");
                            row.put("code", stage.getStageCd());
                            row.put("name", stage.getStageNm());
                            row.put("description", stage.getDescTxt());
                            return row;
                        }, Collectors.toList())));
        for (Map<String, Object> row : rows) {
            List<Map<String, Object>> siteRows = siteMap.get(row.get("code").toString());
            row.put("children", siteMap.get(row.get("code").toString()));

            for (Map<String, Object> siteRow : siteRows) {
                List<Map<String, Object>> plantRows = plantMap.get(siteRow.get("code").toString());
                siteRow.put("children", plantRows);

                for (Map<String, Object> plantRow : plantRows) {
                    List<Map<String, Object>> stageRows = stageMap.get(plantRow.get("code").toString());
                    plantRow.put("children", stageRows);
                }
            }
        }
        return rows;
    }

    public List<WorkOrder> getOrders() {
        List<WorkOrder> workOrders = workOrderService.getWorkOrders();
        List<SalesOrder> salesOrders = salesOrderService.getSalesOrders();

        List<WorkOrder> orders = salesOrders
                .stream()
                .map(salesOrder -> {
                    WorkOrder newOrder = new WorkOrder();
                    newOrder.setWoCd(salesOrder.getSoCd());
                    newOrder.setInventoryCode(salesOrder.getInventoryCode());
                    newOrder.setInventoryName(salesOrder.getInventoryName());
                    newOrder.setRequestQty(salesOrder.getRequestQty());
                    newOrder.setDueDt(salesOrder.getDueDt());
                    newOrder.setDescTxt(salesOrder.getDescTxt());
                    return newOrder;
                })
                .collect(Collectors.toList());
        orders.addAll(workOrders);

        return orders;
    }

    public Map<String, Object> getServerStatus() {
        Server server = applicationProperties.getServer().get("fp");
        if (server == null) {
            return null;
        }

        Map<String, Object> fpServerObject = new HashMap<>();
        fpServerObject.put(ConfigurationConstants.ELEMENT_ID, server.getId());
        fpServerObject.put(ConfigurationConstants.ELEMENT_HOST, server.getHost());
        fpServerObject.put(ConfigurationConstants.ELEMENT_PORT, server.getPort());

        boolean isAlive = NetworkUtil.checkConnection(server.getHost(), server.getPort());
        fpServerObject.put(ConfigurationConstants.ELEMENT_CONNECTION, isAlive);

        return fpServerObject;
    }

}
