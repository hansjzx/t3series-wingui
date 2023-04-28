package com.zionex.t3series.web.domain.fp.item;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemGrpService {

    private final ItemGrpRepository itemGrpRepository;

    public List<ItemGrp> getItemGroups(String search) {
        search = search == null ? "" : search;

        System.out.println(search);

        return itemGrpRepository.findByItemGrpCdContainsOrItemGrpNmContains(search, search);
    }

    public boolean deleteItemGroups(List<ItemGrp> itemGroups) {
        try {
            itemGrpRepository.deleteAll(itemGroups);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

    public boolean saveItemGroups(List<ItemGrp> itemGroups) {
        Map<String, String> itemGroupMap = itemGrpRepository.findAll()
                .stream()
                .collect(Collectors.toMap(ItemGrp::getItemGrpCd, ItemGrp::getId));

        for (ItemGrp itemGroup : itemGroups) {
            if (itemGroup.getId() == null || itemGroup.getId().trim().isEmpty()) {
                itemGroup.setId(itemGroupMap.get(itemGroup.getItemGrpCd()));
            }
        }

        try {
            itemGrpRepository.saveAll(itemGroups);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

}
