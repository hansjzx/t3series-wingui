package com.zionex.t3series.web.domain.fp.item;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;

    private final ItemGrpRepository itemGrpRepository;

    public List<Item> getItems() {
        return itemRepository.findAll();
    }

    public List<Item> getItems(String search) {
        search = search == null ? "" : search;

        return itemRepository.findByItemCdContainsOrItemNmContainsOrderByItemCdAsc(search, search);
    }

    public List<Item> getProducts(String search) {
        search = search == null ? "" : search;

        return itemRepository.findByItemWithClassCd("P", search, search);
    }

    public boolean deleteItems(List<Item> items) {
        try {
            itemRepository.deleteAll(items);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

    public boolean saveItems(List<Item> items) {
        Map<String, ItemGrp> itemGrpMap = new HashMap<>();
        for (ItemGrp itemGrp : itemGrpRepository.findAll()) {
            itemGrpMap.put(itemGrp.getItemGrpCd(), itemGrp);
        }

        Map<String, String> itemMap = itemRepository.findAll()
                .stream()
                .collect(Collectors.toMap(Item::getItemCd, Item::getId));

        for (Item item : items) {
            // Not Null Default Value;
            if (item.getDisplaySeq() == null) {
                item.setDisplaySeq(2147483647);
            }

            ItemGrp itemGrp = itemGrpMap.get(item.getItemGroupCode());
            item.setItemGrp(itemGrp);

            if (item.getId() == null || item.getId().trim().isEmpty()) {
                item.setId(itemMap.get(item.getItemCd()));
            }
        }

        try {
            itemRepository.saveAll(items);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

}
