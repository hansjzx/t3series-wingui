package com.zionex.t3series.web.domain.fp.bor;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BorSetToolService {

    private final BorSetToolRepository borSetToolRepository;

    public List<BorSetTool> getBorSetTools() {
        return borSetToolRepository.findAll();
    }

    public boolean saveBorSetTools(List<BorSetTool> borSetTools) {
        try {
            Map<String, String> borSetToolIdMap = borSetToolRepository.findAll().stream()
                            .collect(Collectors.toMap(BorSetTool::getUniqueKey, BorSetTool::getId));

            for (BorSetTool borSetTool : borSetTools) {
                if (borSetTool.getId() == null) {
                    borSetTool.setId(borSetToolIdMap.get(borSetTool.getUniqueKey()));
                }
            }
            borSetToolRepository.saveAll(borSetTools);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

    public boolean deleteBorSetTools(List<BorSetTool> borSetTools) {
        try {
            borSetToolRepository.deleteAll(borSetTools);
            return true;
        } catch (Exception ignored) {
            System.out.println(ignored);
        }
        return false;
    }

}
