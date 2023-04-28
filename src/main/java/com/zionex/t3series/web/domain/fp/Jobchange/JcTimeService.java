package com.zionex.t3series.web.domain.fp.Jobchange;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.zionex.t3series.web.domain.fp.resource.Resource;
import com.zionex.t3series.web.domain.fp.resource.ResourceService;
import com.zionex.t3series.web.domain.fp.route.Route;
import com.zionex.t3series.web.domain.fp.route.RouteService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JcTimeService {

    private final JcTimeRepository jcTimeRepository;

    private final ResourceService resourceService;
    private final RouteService routeService;

    public List<JcTime> getJcTimes() {
        return jcTimeRepository.findAll();
    }

    public List<JcTime> getJcTimes(String searchResource) {
        searchResource = searchResource == null ? "" : searchResource;

        return jcTimeRepository.findByResource_ResourceCdContains(searchResource);
    }

    public boolean saveJcTimes(List<JcTime> jcTimes) {
        try {
            Map<String, Resource> resourceMap = resourceService.getResources().stream()
                    .collect(Collectors.toMap(Resource::getResourceCd, Function.identity()));

            Map<String, Route> routeMap = routeService.getRoutes().stream()
                    .collect(Collectors.toMap(Route::getRouteCd, Function.identity()));

            Map<String, String> jcTimeIdMap = getJcTimes().stream()
                    .collect(Collectors.toMap(JcTime::getUniqueKey, JcTime::getId));

            for (JcTime jcTime : jcTimes) {
                jcTime.setResource(resourceMap.get(jcTime.getResourceCode()));
                jcTime.setPrevRoute(routeMap.get(jcTime.getPrevRouteCode()));
                jcTime.setNextRoute(routeMap.get(jcTime.getNextRouteCode()));

                if (jcTime.getId() == null || jcTime.getId().trim().isEmpty()) {
                    jcTime.setId(jcTimeIdMap.get(jcTime.getUniqueKey()));
                }
            }

            jcTimeRepository.saveAll(jcTimes);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

    public boolean deleteJcTimes(List<JcTime> jcTimes) {
        try {
            jcTimeRepository.deleteAll(jcTimes);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

}
