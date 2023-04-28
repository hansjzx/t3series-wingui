package com.zionex.t3series.web.domain.fp.wip;

import com.zionex.t3series.web.domain.fp.route.Route;
import com.zionex.t3series.web.domain.fp.route.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WipService {

    private final WipRepository wipRepository;

    private final WipResrcRepository wipResrcRepository;

    private final WipBatchRepository wipBatchRepository;

    private final RouteRepository routeRepository;

    private static final String JOIN_DELIMITER = ", ";

    public List<Wip> getWips(String search) {
        search = search == null ? "" : search;
        List<Wip> wips = wipRepository.findByRoute_RouteCdContainsOrRoute_RouteNmContainsOrderByRoute_RouteCd(search, search);
        Map<Long, String> wipResrcMap = wipResrcRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(WipResrc::getWipId, Collectors.mapping(WipResrc::getResourceCd, Collectors.joining(JOIN_DELIMITER))));
        Map<Long, String> wipBatchGroupMap = wipBatchRepository.findAll()
                .stream()
                .collect(Collectors.toMap(WipBatch::getWipId, WipBatch::getBatchGrpCd));

        for (Wip wip : wips) {
            wip.setResourceCd(wipResrcMap.get(wip.getWipId()));
            wip.setBatchGrpCd(wipBatchGroupMap.get(wip.getWipId()));
            double wipQty = (wip.getWipQty() == null) ? 0 : wip.getWipQty();
            double remainQty = (wip.getRemainQty() == null) ? 0 : wip.getRemainQty();
            wip.setActualQty(wipQty - remainQty);
        }

        return wips;
    }

    public boolean saveWips(List<Wip> wips) {
        Map<Long, Wip> wipMap = wipRepository.findAll()
                .stream()
                .collect(Collectors.toMap(Wip::getWipId, Function.identity()));

        Map<String, Route> routeMap = routeRepository.findAll()
                .stream()
                .collect(Collectors.toMap(Route::getRouteCd, Function.identity()));

        Map<Long, List<WipResrc>> wipResrcMap = wipResrcRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(WipResrc::getWipId, Collectors.toList()));

        Map<Long, List<WipBatch>> wipBatchMap = wipBatchRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(WipBatch::getWipId, Collectors.toList()));

        List<WipResrc> deleteWipResrces = new ArrayList<>();
        List<WipResrc> saveWipResrces = new ArrayList<>();
        List<WipBatch> deleteWipBatches = new ArrayList<>();
        List<WipBatch> saveWipBatches = new ArrayList<>();

        Wip firstWip = wipRepository.findTop1ByOrderByWipIdDesc();
        long maxWipId = 0;
        if (firstWip != null) {
            maxWipId = firstWip.getWipId();
        }

        for (Wip wip : wips) {
            Route route = routeMap.get(wip.getRouteCode());
            wip.setRoute(route);

            if (wip.getId() == null || wip.getId().trim().isEmpty()) {
                Wip existWip = wipMap.get(wip.getWipId());
                if (existWip != null) {
                    wip.setId(existWip.getId());
                } else {
                    wip.setWipId(maxWipId + 1);
                    maxWipId += 1;
                }
            }

            Long wipId = wip.getWipId();
            double wipQty = (wip.getWipQty() == null) ? 0 : wip.getWipQty();
            double actualQty = (wip.getActualQty() == null) ? wipQty : wip.getActualQty();
            wip.setRemainQty(wipQty - actualQty);

            if (wipResrcMap.containsKey(wipId)) {
                deleteWipResrces.addAll(wipResrcMap.get(wipId));
            }
            String resourceCd = wip.getResourceCd();
            if (StringUtils.isNotBlank(resourceCd)) {
                String[] resourceCds = resourceCd.split(",");
                for (String resrcCd : resourceCds) {
                    resrcCd = resrcCd.trim();
                    WipResrc wipResrc = new WipResrc();
                    wipResrc.setWipId(wipId);
                    wipResrc.setResourceCd(resrcCd);
                    saveWipResrces.add(wipResrc);
                }
            }

            if (wipBatchMap.containsKey(wipId)) {
                deleteWipBatches.addAll(wipBatchMap.get(wipId));
            }
            WipBatch wipBatch = new WipBatch();
            wipBatch.setWipId(wipId);
            wipBatch.setBatchGrpCd(wip.getBatchGrpCd());
            saveWipBatches.add(wipBatch);
        }

        try {
            wipRepository.saveAll(wips);
            wipResrcRepository.deleteAll(deleteWipResrces);
            wipResrcRepository.saveAll(saveWipResrces);
            wipBatchRepository.deleteAll(deleteWipBatches);
            wipBatchRepository.saveAll(saveWipBatches);
            return true;
        } catch (Exception ignored) {
        }
        return false;

    }

    public boolean deleteWips(List<Wip> wips) {
        Map<Long, List<WipResrc>> wipResrcMap = wipResrcRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(WipResrc::getWipId, Collectors.toList()));

        Map<Long, List<WipBatch>> wipBatchMap = wipBatchRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(WipBatch::getWipId, Collectors.toList()));

        List<WipResrc> wipResrces = new ArrayList<>();
        List<WipBatch> wipBatches = new ArrayList<>();

        for (Wip wip : wips) {
            Long wipId = wip.getWipId();
            if (wipResrcMap.containsKey(wipId)) {
                wipResrces.addAll(wipResrcMap.get(wipId));
            }
            if (wipBatchMap.containsKey(wipId)) {
                wipBatches.addAll(wipBatchMap.get(wipId));
            }
        }

        try {
            wipRepository.deleteAll(wips);
            wipResrcRepository.deleteAll(wipResrces);
            wipBatchRepository.deleteAll(wipBatches);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }


}
