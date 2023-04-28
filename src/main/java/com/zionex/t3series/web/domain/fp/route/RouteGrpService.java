package com.zionex.t3series.web.domain.fp.route;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteGrpService {

    private final RouteGrpRepository routeGrpRepository;

    public List<RouteGrp> getRouteGroups() {
        return routeGrpRepository.findAll();
    }

    public List<RouteGrp> getRouteGroups(String param) {
        param = param == null ? "" : param;

        return routeGrpRepository.findByRouteGrpCdContains(param);
    }

    public boolean deleteRouteGroups(List<RouteGrp> routeGroups) {
        try {
            routeGrpRepository.deleteAll(routeGroups);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

    public boolean saveRouteGroups(List<RouteGrp> routeGroups) {
        Map<String, String> routeGroupMap = routeGrpRepository.findAll()
                .stream()
                .collect(Collectors.toMap(RouteGrp::getRouteGrpCd, RouteGrp::getId));

        for (RouteGrp routeGroup : routeGroups) {
            if (routeGroup.getId() == null || routeGroup.getId().trim().isEmpty()) {
                routeGroup.setId(routeGroupMap.get(routeGroup.getRouteGrpCd()));
            }
        }

        try {
            routeGrpRepository.saveAll(routeGroups);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

}
