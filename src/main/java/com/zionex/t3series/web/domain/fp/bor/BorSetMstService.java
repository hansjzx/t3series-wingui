package com.zionex.t3series.web.domain.fp.bor;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BorSetMstService {

    private final BorSetMstRepository borSetMstRepository;

    public boolean saveBorSetMst(List<BorSetMst> borSetMsts) {
        try {
            Map<String, String> borSetIdMap = borSetMstRepository.findAll().stream()
                    .collect(Collectors.toMap(BorSetMst::getBorSetCd, BorSetMst::getId));

            for (BorSetMst borSetMst : borSetMsts) {
                if (borSetMst.getId() == null) {
                    borSetMst.setId(borSetIdMap.get(borSetMst.getBorSetCd()));
                }
            }
            borSetMstRepository.saveAll(borSetMsts);
            return true;
        } catch (Exception ignored) {
            System.out.println(ignored);
        }
        return false;
    }

    public BorSetMst getBorSetMst(String borSetCd) {
        return borSetMstRepository.findByBorSetCd(borSetCd);
    }

    public boolean deleteBorSetMst(BorSetMst borSetMst) {
        try {
            borSetMstRepository.delete(borSetMst);
            return true;
        } catch (Exception ignored) {

        }
        return false;
    }


}
