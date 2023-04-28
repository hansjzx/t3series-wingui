package com.zionex.t3series.web.domain.fp.bor;

import com.zionex.t3series.web.domain.fp.order.WorkOrder;
import com.zionex.t3series.web.domain.fp.order.WorkOrderService;
import com.zionex.t3series.web.domain.fp.resource.ResourceService;
import com.zionex.t3series.web.domain.fp.route.Route;
import com.zionex.t3series.web.domain.fp.route.RouteGrp;
import com.zionex.t3series.web.domain.fp.route.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BorService {

    private final BorRepository borRepository;

    private final ResourceService resourceService;

    private final RouteService routeService;

    private final WorkOrderService workOrderService;

    private final BorQueryRepository borQueryRepository;

    public List<Bor> getBors() {
        return borRepository.findAll();
    }

    public List<Bor> getBors(String woCd) {
        String inventoryCd = workOrderService.getWorkOrders(woCd)
                .stream()
                .filter(wo -> woCd.equals(wo.getWoCd()))
                .map(WorkOrder::getInventoryCd)
                .findFirst().orElse("");

        return borQueryRepository.getBorsByInventoryCd(inventoryCd);
    }

    public List<Bor> getBorResources(String routeCode) {
        return borRepository.findByRoute_RouteCd(routeCode);
    }

    public List<Route> getBorRoutes(String resourceCode) {
        return borRepository.findByResource_ResourceCd(resourceCode).stream()
                .map(Bor::getRoute)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<RouteGrp> getBorRouteGroups(String resourceCode) {
        return borRepository.findByResource_ResourceCd(resourceCode).stream()
                .map(bor -> bor.getRoute().getRouteGrp())
                .distinct()
                .collect(Collectors.toList());
    }

    public boolean saveBors(List<Bor> bors) {
        try {
            Map<String, String> borIdMap = borRepository.findAll().stream()
                    .collect(Collectors.toMap(Bor::getUniqueKey, Bor::getId));

            for (Bor bor : bors) {
                bor.setResource(resourceService.getResource(bor.getResourceCode()));
                bor.setRoute(routeService.getRoute(bor.getRouteCode()));

                if (bor.getId() == null || bor.getId().trim().isEmpty()) {
                    String key = bor.getRouteCode() + "_" + bor.getResourceCode();
                    bor.setId(borIdMap.get(key));
                }
            }

            borRepository.saveAll(bors);
            return true;
        } catch (Exception ignored) {
            System.out.println(ignored);
        }
        return false;
    }

    public boolean deleteBors(List<Bor> bors) {
        try {
            borRepository.deleteAll(bors);
            return true;
        } catch (Exception ignored) {
            System.out.println(ignored);
        }
        return false;
    }

}
