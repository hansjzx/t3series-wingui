package com.zionex.t3series.web.domain.fp.bor;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.zionex.t3series.web.domain.fp.resource.Resource;
import com.zionex.t3series.web.domain.fp.resource.ResourceService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ToolSupplyService {

    private final ToolSupplyRepository toolSupplyRepository;

    private final ResourceService resourceService;

    public List<ToolSupply> getToolSupplies(String toolResourceCode) {
        List<ToolSupply> toolSupplies = toolSupplyRepository.findByResource_ResourceCdOrderBySupplyTsAsc(toolResourceCode);

        for (int index = 0; index < toolSupplies.size(); index++) {
            if (index == 0) {
                if (toolSupplies.get(index).getSupplyCnt() < 0) {
                    toolSupplies.get(index).setInoutType("OUT");
                } else {
                    toolSupplies.get(index).setInoutType("IN");
                }
                toolSupplies.get(index).setChangeCnt(Math.abs(toolSupplies.get(index).getSupplyCnt()));
                toolSupplies.get(index).setTotalCnt(toolSupplies.get(index).getToolCnt() + toolSupplies.get(index).getSupplyCnt());
            } else {
                ToolSupply beforeToolSupply = toolSupplies.get(index - 1);

                if (toolSupplies.get(index).getSupplyCnt() < beforeToolSupply.getSupplyCnt()) {
                    toolSupplies.get(index).setInoutType("OUT");
                    toolSupplies.get(index).setChangeCnt(Math.abs(beforeToolSupply.getSupplyCnt() - toolSupplies.get(index).getSupplyCnt()));
                    toolSupplies.get(index).setTotalCnt(beforeToolSupply.getTotalCnt() - toolSupplies.get(index).getChangeCnt());
                } else {
                    toolSupplies.get(index).setInoutType("IN");
                    toolSupplies.get(index).setChangeCnt(Math.abs(toolSupplies.get(index).getSupplyCnt() - beforeToolSupply.getSupplyCnt()));
                    toolSupplies.get(index).setTotalCnt(beforeToolSupply.getTotalCnt() + toolSupplies.get(index).getChangeCnt());
                }
            }
        }

        return toolSupplies;
    }

    public boolean saveToolSupplies(List<ToolSupply> toolSupplies) {
        try {
            Map<String, Resource> toolResourceMap = resourceService.getToolResources("").stream()
                    .collect(Collectors.toMap(Resource::getResourceCd, Function.identity()));

            for (ToolSupply toolSupply : toolSupplies) {
                toolSupply.setResource(toolResourceMap.get(toolSupply.getToolResourceCode()));
            }
            toolSupplyRepository.saveAll(toolSupplies);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

    public Boolean deleteToolSupplies(List<ToolSupply> toolSupplies) {
        try {
            toolSupplyRepository.deleteAll(toolSupplies);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

}
