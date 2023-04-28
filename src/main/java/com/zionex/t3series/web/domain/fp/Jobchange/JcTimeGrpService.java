package com.zionex.t3series.web.domain.fp.Jobchange;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.zionex.t3series.web.domain.fp.resource.Resource;
import com.zionex.t3series.web.domain.fp.resource.ResourceService;
import com.zionex.t3series.web.domain.fp.route.RouteGrp;
import com.zionex.t3series.web.domain.fp.route.RouteGrpService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JcTimeGrpService {

    private final JcTimeGrpRepository jcTimeGrpRepository;

    private final ResourceService resourceService;
    private final RouteGrpService routeGrpService;

    public List<JcTimeGrp> getJcTimeGroups() {
        return jcTimeGrpRepository.findAll();
    }

    public List<JcTimeGrp> getJcTimeGroups(String searchResource) {
        searchResource = searchResource == null ? "" : searchResource;

        return jcTimeGrpRepository.findByResource_ResourceCdContains(searchResource);
    }

    public boolean saveJcTimeGroups(List<JcTimeGrp> jcTimeGrps) {
        try {
            Map<String, Resource> resourceMap = resourceService.getResources().stream()
                    .collect(Collectors.toMap(Resource::getResourceCd, Function.identity()));

            Map<String, RouteGrp> routeGrpMap = routeGrpService.getRouteGroups().stream()
                    .collect(Collectors.toMap(RouteGrp::getRouteGrpCd, Function.identity()));

            Map<String, String> jcTimeGrpIdMap = getJcTimeGroups().stream()
                    .collect(Collectors.toMap(JcTimeGrp::getUniqueKey, JcTimeGrp::getId));

            for (JcTimeGrp jcTimeGrp : jcTimeGrps) {
                jcTimeGrp.setResource(resourceMap.get(jcTimeGrp.getResourceCode()));
                jcTimeGrp.setPrevRouteGrp(routeGrpMap.get(jcTimeGrp.getPrevRouteGrpCode()));
                jcTimeGrp.setNextRouteGrp(routeGrpMap.get(jcTimeGrp.getNextRouteGrpCode()));

                if (jcTimeGrp.getId() == null || jcTimeGrp.getId().trim().isEmpty()) {
                    jcTimeGrp.setId(jcTimeGrpIdMap.get(jcTimeGrp.getUniqueKey()));
                }
            }

            jcTimeGrpRepository.saveAll(jcTimeGrps);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

    public boolean deleteJcTimeGroups(List<JcTimeGrp> jcTimeGrps) {
        try {
            jcTimeGrpRepository.deleteAll(jcTimeGrps);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

}
