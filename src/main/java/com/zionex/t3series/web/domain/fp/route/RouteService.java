package com.zionex.t3series.web.domain.fp.route;

import com.zionex.t3series.web.domain.fp.organization.Stage;
import com.zionex.t3series.web.domain.fp.organization.StageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final RouteRepository routeRepository;

    private final RouteGrpRepository routeGrpRepository;

    private final StageRepository stageRepository;

    public Route getRoute(String routeCd) {
        return routeRepository.findTop1ByRouteCd(routeCd);
    }

    public List<Route> getRoutes() {
        return routeRepository.findAll();
    }

    public List<Route> getRoutes(String routeCd) {
        routeCd = routeCd == null ? "" : routeCd;

        return routeRepository.findByRouteCdContains(routeCd);
    }

    public boolean deleteRoutes(List<Route> routes) {
        try {
            routeRepository.deleteAll(routes);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

    public boolean saveRoutes(List<Route> routes) {
        Map<String, RouteGrp> routeGrpMap = new HashMap<>();
        for (RouteGrp routeGrp : routeGrpRepository.findAll()) {
            routeGrpMap.put(routeGrp.getRouteGrpCd(), routeGrp);
        }

        Map<String, Stage> stageMap = stageRepository.findAll()
                .stream()
                .collect(Collectors.toMap(Stage::getStageCd, Function.identity()));

        Map<String, String> routeMap = routeRepository.findAll()
                .stream()
                .collect(Collectors.toMap(Route::getRouteCd, Route::getId));

        for (Route route : routes) {
            // Not Null Default Value;
            if (route.getBatchRouteYn() == null) {
                route.setBatchRouteYn(false);
            }

            RouteGrp routeGrp = routeGrpMap.get(route.getRouteGroupCode());
            route.setRouteGrp(routeGrp);

            Stage stage = stageMap.get(route.getStageCode());
            route.setStage(stage);

            if (route.getId() == null || route.getId().trim().isEmpty()) {
                route.setId(routeMap.get(route.getRouteCd()));
            }
        }

        try {
            routeRepository.saveAll(routes);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }
}
