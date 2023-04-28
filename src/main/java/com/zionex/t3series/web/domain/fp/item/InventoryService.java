package com.zionex.t3series.web.domain.fp.item;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.zionex.t3series.web.domain.fp.organization.Stage;
import com.zionex.t3series.web.domain.fp.organization.StageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    private final ItemRepository itemRepository;

    private final StageRepository stageRepository;


    public List<Inventory> getInventories() {
        return inventoryRepository.findAll();
    }

    public List<Inventory> getInventories(String search) {
        search = search == null ? "" : search;

        return inventoryRepository.findByInventoryCdContainsOrInventoryNmContainsOrderByInventoryCdAsc(search, search);
    }

    public boolean deleteInventories(List<Inventory> inventories) {
        try {
            inventoryRepository.deleteAll(inventories);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

    public boolean saveInventories(List<Inventory> inventories) {
        Map<String, Item> itemMap = new HashMap<>();
        for (Item item : itemRepository.findAll()) {
            itemMap.put(item.getItemCd(), item);
        }

        Map<String, Stage> stageMap = new HashMap<>();
        for (Stage stage : stageRepository.findAll()) {
            stageMap.put(stage.getStageCd(), stage);
        }

        Map<String, String> inventoryMap = inventoryRepository.findAll()
                .stream()
                .collect(Collectors.toMap(Inventory::getInventoryCd, Inventory::getId));

        for (Inventory inventory : inventories) {
            // Not Null Default Value;
            if (inventory.getStockSelectTpCd() == null) {
                inventory.setStockSelectTpCd("SC");
            }

            if (inventory.getInventoryGrpCd() == null) {
                inventory.setInventoryGrpCd("INVENTORY_GROUP");
            }

            Item item = itemMap.get(inventory.getItemCode());
            inventory.setItem(item);

            Stage stage = stageMap.get(inventory.getStageCode());
            inventory.setStage(stage);

            if (inventory.getId() == null || inventory.getId().trim().isEmpty()) {
                inventory.setId(inventoryMap.get(inventory.getInventoryCd()));
            }
        }

        try {
            inventoryRepository.saveAll(inventories);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

}
