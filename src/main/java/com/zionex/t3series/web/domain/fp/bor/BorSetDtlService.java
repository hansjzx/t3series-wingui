package com.zionex.t3series.web.domain.fp.bor;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BorSetDtlService {

    private final BorSetDtlRepository borSetDtlRepository;

    private final BorSetMstService borSetMstService;


    public String getNextBorSetCode(String routeCode, String resourceCode) {
        BorSetDtl maxBorSetDtl = borSetDtlRepository.findTop1ByRoute_RouteCdAndResource_ResourceCdOrderByBorSetMst_BorSetCdDesc(routeCode, resourceCode);

        if (maxBorSetDtl == null) {
            return routeCode + "@" + resourceCode + "_#001";
        }

        String maxBorSetCode = maxBorSetDtl.getBorSetCode();
        int nextBorIndex = Integer.parseInt(maxBorSetCode.substring(maxBorSetCode.length() - 3)) + 1;

        return routeCode + "@" + resourceCode + "_#" + String.format("%03d", nextBorIndex);
    }

    public boolean saveBorSetDtls(List<BorSetDtl> borSetDtls) {
        try {
            Map<String, String> borSetDtlIdMap = borSetDtlRepository.findAll().stream()
                    .collect(Collectors.toMap(BorSetDtl::getUniqueKey, BorSetDtl::getId));

            for (BorSetDtl borSetDtl : borSetDtls) {
                if (borSetDtl.getId() == null) {
                    borSetDtl.setId(borSetDtlIdMap.get(borSetDtl.getUniqueKey()));
                }
            }

            borSetDtlRepository.saveAll(borSetDtls);

            return true;
        } catch (Exception ignored) {
            System.out.println(ignored);
        }
        return false;
    }

    public List<BorSetDtl> getBorSetDtls(String routeCode) {
        return borSetDtlRepository.findByRoute_RouteCdOrderByBorSetMst_BorSetCdAsc(routeCode);
    }

    public List<BorSetDtl> getBorSetDtls(String searchRoute, String searchResource) {
        return borSetDtlRepository.getBorSetDtls(searchRoute, searchResource);
    }

    public boolean deleteBorSetDtls(List<BorSetDtl> borSetDtls) {
        try {

            for (BorSetDtl borSetDtl : borSetDtls) {

                BorSetMst borSetMst = borSetMstService.getBorSetMst(borSetDtl.getBorSetCode());

                if (borSetMst != null) {
                    borSetMstService.deleteBorSetMst(borSetMst);
                }
            }
            borSetDtlRepository.deleteAll(borSetDtls);
            return true;
        } catch (Exception ignored) {
            System.out.println(ignored);
        }
        return false;
    }

}
