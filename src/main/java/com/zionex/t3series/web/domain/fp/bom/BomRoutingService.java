package com.zionex.t3series.web.domain.fp.bom;

import com.zionex.t3series.web.domain.fp.item.Inventory;
import com.zionex.t3series.web.domain.fp.item.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BomRoutingService {

    private final BomRoutingRepository bomRoutingRepository;

    private final InventoryRepository inventoryRepository;

    public List<BomRouting> getBomRouting() {
        return bomRoutingRepository.findAll();
    }

    public List<BomRouting> getProducingBomRouting(String search) {
        search = search == null ? "" : search;

        return bomRoutingRepository.findByBomTpCd("P");
    }

    public List<Map<String, Object>> getBomTreeTopDown(String itemCode) {
        List<Map<String, Object>> bomTreeMapList = new ArrayList<>();

        try {
            Inventory product = inventoryRepository.findTop1ByItem_itemCd(itemCode);
            BomRouting topBomRouting = bomRoutingRepository.findByBomTpCdAndInventory_inventoryCd("P", product.getInventoryCd()).get(0);

            topBomRouting.setLevel(0);
            topBomRouting.setProductRate(topBomRouting.getBomRate());

            bomTreeMapList.add(getChild(setMap(topBomRouting), topBomRouting));

        } catch (Exception ignored) {
        }

        return bomTreeMapList;
    }

    public List<Map<String, Object>> getBomTreeBottomUp(String itemCode) {
        List<Map<String, Object>> bomTreeMapList = new ArrayList<>();

        try {
            Inventory product = inventoryRepository.findTop1ByItem_itemCd(itemCode);

            List<BomRouting> bottomRoutingList = bomRoutingRepository.findByBomTpCdAndInventory_inventoryCd("C", product.getInventoryCd());

            if (bottomRoutingList != null && !bottomRoutingList.isEmpty()) {
                for (BomRouting bomRouting : bottomRoutingList) {
                    bomRouting.setLevel(1);
                    bomRouting.setProductRate(bomRouting.getBomRate());

                    bomTreeMapList.add(getParent(setMap(bomRouting), bomRouting));
                }
            }

        } catch (Exception ignored) {
        }

        return bomTreeMapList;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getParent(Map<String, Object> parentMap, BomRouting parent) {

        List<BomRouting> childBomRoutingList = bomRoutingRepository.findByBomTpCdAndRoute_RouteCd("P", parent.getRouteCode());

        if (childBomRoutingList != null && !childBomRoutingList.isEmpty()) {
            for (BomRouting childBomRouting : childBomRoutingList) {
                childBomRouting.setLevel(parent.getLevel() + 1);
                childBomRouting.setProductRate(parent.getProductRate() * childBomRouting.getBomRate());
                Map<String, Object> childMap = setMap(childBomRouting);

                ArrayList<Map<String, Object>> childrenList = (ArrayList<Map<String, Object>>) parentMap.get("children");
                if (childrenList == null || childrenList.isEmpty()) {
                    childrenList = new ArrayList<>();
                }

                childrenList.add(childMap);

                parentMap.put("children", childrenList);

                List<BomRouting> nextBomRoutingList = bomRoutingRepository.findByBomTpCdAndInventory_inventoryCd("C", childBomRouting.getInventoryCode());
                if (nextBomRoutingList != null && !nextBomRoutingList.isEmpty()) {
                    for (BomRouting nextBomRouting : nextBomRoutingList) {
                        nextBomRouting.setLevel(childBomRouting.getLevel());
                        nextBomRouting.setProductRate(childBomRouting.getProductRate());
                        getParent(childMap, nextBomRouting);
                    }
                }
            }
        }

        return parentMap;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getChild(Map<String, Object> parentMap, BomRouting parent) {

        List<BomRouting> childBomRoutingList = bomRoutingRepository.findByBomTpCdAndRoute_RouteCd("C", parent.getRouteCode());

        if (childBomRoutingList != null && !childBomRoutingList.isEmpty()) {
            for (BomRouting childBomRouting : childBomRoutingList) {
                childBomRouting.setLevel(parent.getLevel() + 1);
                childBomRouting.setProductRate(parent.getProductRate() * childBomRouting.getBomRate());
                Map<String, Object> childMap = setMap(childBomRouting);

                ArrayList<Map<String, Object>> childrenList = (ArrayList<Map<String, Object>>) parentMap.get("children");
                if (childrenList == null || childrenList.isEmpty()) {
                    childrenList = new ArrayList<>();
                }

                childrenList.add(childMap);

                parentMap.put("children", childrenList);

                List<BomRouting> nextBomRoutingList = bomRoutingRepository.findByBomTpCdAndInventory_inventoryCd("P", childBomRouting.getInventoryCode());
                if (nextBomRoutingList != null && !nextBomRoutingList.isEmpty()) {
                    for (BomRouting nextBomRouting : nextBomRoutingList) {
                        nextBomRouting.setLevel(childBomRouting.getLevel());
                        nextBomRouting.setProductRate(childBomRouting.getProductRate());
                        getChild(childMap, nextBomRouting);
                    }
                }
            }
        }

        return parentMap;
    }

    private Map<String, Object> setMap(BomRouting bomRouting) {
        Map<String, Object> bom = new HashMap<>();

        int icon = 0;

        if (bomRouting.getItemClassCode().equals("M")) {
            icon = 2;
        } else if (bomRouting.getItemClassCode().equals("I")) {
            icon = 1;
        }

        bom.put("level", bomRouting.getLevel());
        bom.put("icon", icon);
        bom.put("itemCode", bomRouting.getItemCode());
        bom.put("itemName", bomRouting.getItemName());
        bom.put("itemClassCode", bomRouting.getItemClassCode());
        bom.put("itemUom", bomRouting.getItemUom());
        bom.put("bomRate", bomRouting.getBomRate());
        bom.put("productRate", bomRouting.getProductRate());

        return bom;
    }

}
