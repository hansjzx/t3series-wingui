package com.zionex.t3series.web.domain.fp.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, String> {

    List<Inventory> findByInventoryCdContainsOrInventoryNmContainsOrderByInventoryCdAsc(String itemCode, String itemName);

    Inventory findTop1ByItem_itemCd(String itemCode);
}
