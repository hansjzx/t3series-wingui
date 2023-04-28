package com.zionex.t3series.web.domain.fp.master;

import com.zionex.t3series.web.domain.fp.bor.Bor;
import com.zionex.t3series.web.domain.fp.bor.BorQueryRepository;
import com.zionex.t3series.web.domain.fp.bor.BorService;
import com.zionex.t3series.web.domain.fp.bor.BorSetDtl;
import com.zionex.t3series.web.domain.fp.bor.BorSetDtlService;
import com.zionex.t3series.web.domain.fp.bor.BorSetMst;
import com.zionex.t3series.web.domain.fp.bor.BorSetMstService;
import com.zionex.t3series.web.domain.fp.bor.BorSetTool;
import com.zionex.t3series.web.domain.fp.bor.BorSetToolService;
import com.zionex.t3series.web.domain.fp.resource.ResourceService;
import com.zionex.t3series.web.domain.fp.route.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BorMstService {

    private final BorQueryRepository borQueryRepository;

    private final BorSetMstService borSetMstService;

    private final BorSetDtlService borSetDtlService;

    private final BorService borService;

    private final ResourceService resourceService;

    private final RouteService routeService;

    private final BorSetToolService borSetToolService;

    public List<BorSetDtl> getBorSets(String searchRoute) {
        searchRoute = searchRoute == null ? "" : searchRoute;
        return borSetDtlService.getBorSetDtls(searchRoute);
    }

    public List<BorMaster> getBors(String searchItem, String searchRoute, String searchResource) {
        searchItem = searchItem == null ? "" : searchItem;
        searchRoute = searchRoute == null ? "" : searchRoute;
        searchResource = searchResource == null ? "" : searchResource;

        return borQueryRepository.getBorMasters(searchItem, searchRoute, searchResource);
    }

    public List<Bor> getBorResources(String searchRouteCode) {
        searchRouteCode = searchRouteCode == null ? "" : searchRouteCode;

        return borService.getBorResources(searchRouteCode);
    }

    public Boolean saveBorSets(List<Bor> bors) {

        try {
            List<Bor> mainBor = bors.stream()
                    .filter(Bor::getIsMainResource)
                    .collect(Collectors.toList());

            String routeCode = mainBor.get(0).getRouteCode();
            String resourceCode = mainBor.get(0).getResourceCode();
            String borSetMstDescTxt = mainBor.get(0).getBorSetMstDescTxt();


            String nextBorSetCode = borSetDtlService.getNextBorSetCode(routeCode, resourceCode);

            BorSetMst borSetMst = new BorSetMst();
            borSetMst.setBorSetCd(nextBorSetCode);
            borSetMst.setDescTxt(borSetMstDescTxt);

            List<BorSetMst> borSetMsts = new ArrayList<>();
            borSetMsts.add(borSetMst);

            borSetMstService.saveBorSetMst(borSetMsts);

            List<BorSetDtl> borSetDtls = new ArrayList<>();
            for (Bor bor : bors) {
                BorSetDtl borSetDtl = new BorSetDtl();
                borSetDtl.setBorSetMst(borSetMstService.getBorSetMst(nextBorSetCode));
                borSetDtl.setRoute(routeService.getRoute(bor.getRouteCode()));
                borSetDtl.setResource(resourceService.getResource(bor.getResourceCode()));
                if (bor.getIsMainResource()) {
                    borSetDtl.setResourceTpCd("M");
                } else {
                    borSetDtl.setResourceTpCd("S");
                }

                borSetDtls.add(borSetDtl);
            }

            return borSetDtlService.saveBorSetDtls(borSetDtls);


        } catch (Exception ignored) {
        }

        return false;
    }

    public Boolean saveBors(List<BorMaster> borMasters) {
        try {
            List<Bor> bors = new ArrayList<>();
            for (BorMaster borMaster : borMasters) {
                Bor bor = new Bor();
                bor.setId(borMaster.getId());
                bor.setRouteCode(borMaster.getRouteCode());
                bor.setResourceCode(borMaster.getResourceCode());
                bor.setAltResourcePriority(borMaster.getAltResourcePriority());
                bor.setEfficiency(borMaster.getEfficiency());
                bor.setQueueTm(borMaster.getQueueTm());
                bor.setSetupTm(borMaster.getSetupTm());
                bor.setProcessTm(borMaster.getProcessTm());
                bor.setWaitTm(borMaster.getWaitTm());
                bor.setMoveTm(borMaster.getMoveTm());
                bor.setTransferBatchTm(borMaster.getTransferBatchTm());
                bor.setStdProcessTm(borMaster.getStdProcessTm());
                bor.setTimeUom(borMaster.getTimeUom());
                bor.setLotSizeMin(borMaster.getLotSizeMin());
                bor.setLotSizeMax(borMaster.getLotSizeMax());
                bor.setLotSizeMultiplr(borMaster.getLotSizeMultiplr());
                bor.setDivideTpCd(borMaster.getDivideTpCd());
                bor.setDescTxt(borMaster.getDescTxt());

                bors.add(bor);
            }
            return borService.saveBors(bors);
        } catch (Exception ignored) {
        }
        return false;
    }

    public Boolean deleteBors(List<BorMaster> borMasters) {
        try {
            List<Bor> bors = new ArrayList<>();
            for (BorMaster borMaster : borMasters) {
                Bor bor = new Bor();
                bor.setId(borMaster.getId());

                bors.add(bor);
            }
            return borService.deleteBors(bors);
        } catch (Exception ignored) {
        }
        return false;
    }

    public Boolean deleteBorSets(List<BorSetDtl> borSetDtls) {
        try {
            return borSetDtlService.deleteBorSetDtls(borSetDtls);
        } catch (Exception ignored) {
        }
        return false;
    }

    public List<ToolSettingMaster> getBorSetTools(String searchRoute, String searchResource) {
        Map<String, List<BorSetDtl>> borSetDtlMap = borSetDtlService.getBorSetDtls(searchRoute, searchResource).stream()
                .collect(Collectors.groupingBy(BorSetDtl::getBorSetCd, Collectors.mapping(Function.identity(), Collectors.toList())));

        Map<String, List<BorSetTool>> borSetToolMap = borSetToolService.getBorSetTools().stream()
                .collect(Collectors.groupingBy(BorSetTool::getBorSetCd, Collectors.mapping(Function.identity(), Collectors.toList())));

        List<ToolSettingMaster> toolSettingMasters = new ArrayList<>();

        for (Map.Entry<String, List<BorSetDtl>> entry : borSetDtlMap.entrySet()) {
            int length = entry.getValue().size();
            int index = 0;

            for (BorSetDtl borSetDtl : entry.getValue()) {
                index++;

                ToolSettingMaster toolSettingMaster = new ToolSettingMaster();
                toolSettingMaster.setId(null);
                toolSettingMaster.setRouteCode(borSetDtl.getRouteCode());
                toolSettingMaster.setRouteName(borSetDtl.getRouteName());
                toolSettingMaster.setBorSetCode(borSetDtl.getBorSetCode());
                toolSettingMaster.setBorSetMstDescTxt(borSetDtl.getBorSetMstDescTxt());
                toolSettingMaster.setResourceCode(borSetDtl.getResourceCode());
                toolSettingMaster.setResourceName(borSetDtl.getResourceName());
                toolSettingMaster.setUsableCnt(0L);
                toolSettingMaster.setIsTool(false);
                toolSettingMaster.setToolCnt(0L);

                toolSettingMasters.add(toolSettingMaster);

                if (index == length) {
                    List<BorSetTool> borSetTools = borSetToolMap.get(borSetDtl.getBorSetCode());

                    if (borSetTools != null && borSetTools.size() > 0) {
                        for (BorSetTool borSetTool : borSetTools) {

                            ToolSettingMaster borSetToolMaster = new ToolSettingMaster();
                            borSetToolMaster.setId(borSetTool.getId());
                            borSetToolMaster.setRouteCode(borSetDtl.getRouteCode());
                            borSetToolMaster.setRouteName(borSetDtl.getRouteName());
                            borSetToolMaster.setBorSetCode(borSetDtl.getBorSetCode());
                            borSetToolMaster.setBorSetMstDescTxt(borSetDtl.getBorSetMstDescTxt());
                            borSetToolMaster.setResourceCode(borSetTool.getToolResourceCode());
                            borSetToolMaster.setResourceName(borSetTool.getToolResourceName());
                            borSetToolMaster.setUsableCnt(borSetTool.getUsableCnt());
                            borSetToolMaster.setIsTool(true);
                            borSetToolMaster.setToolCnt(borSetTool.getToolCnt());

                            toolSettingMasters.add(borSetToolMaster);
                        }
                    }

                }
            }
        }

        return toolSettingMasters;
    }

    public Boolean saveBorSetTools(List<ToolSettingMaster> toolSettingMasters) {
        try {
            List<BorSetTool> borSetTools = new ArrayList<>();

            for (ToolSettingMaster toolSettingMaster : toolSettingMasters) {
                BorSetTool borSetTool = new BorSetTool();
                borSetTool.setId(toolSettingMaster.getId());
                borSetTool.setBorSetCd(toolSettingMaster.getBorSetCode());
                borSetTool.setResource(resourceService.getResource(toolSettingMaster.getResourceCode()));
                borSetTool.setUsableCnt(toolSettingMaster.getUsableCnt());

                borSetTools.add(borSetTool);
            }
            return borSetToolService.saveBorSetTools(borSetTools);
        } catch (Exception ignored) {
        }
        return false;
    }

    public Boolean deleteBorSetTools(List<ToolSettingMaster> toolSettingMasters) {
        try {
            List<BorSetTool> borSetTools = new ArrayList<>();

            for (ToolSettingMaster toolSettingMaster : toolSettingMasters) {
                BorSetTool borSetTool = new BorSetTool();
                borSetTool.setId(toolSettingMaster.getId());
                borSetTools.add(borSetTool);
            }
            return borSetToolService.deleteBorSetTools(borSetTools);
        } catch (Exception ignored) {
        }
        return false;
    }

}
