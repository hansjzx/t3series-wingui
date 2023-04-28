package com.zionex.t3series.web.domain.fp.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, String> {

    List<Item> findByItemCdContainsOrItemNmContainsOrderByItemCdAsc(String itemCode, String itemName);

    @Query("select i from Item i where i.itemClassCd = ?1 and (i.itemCd like %?2% or i.itemNm like %?3%)")
    List<Item> findByItemWithClassCd(String itemClassCode, String itemCode, String itemName);

}
