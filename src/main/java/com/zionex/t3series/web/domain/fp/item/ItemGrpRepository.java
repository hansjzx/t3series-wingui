package com.zionex.t3series.web.domain.fp.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemGrpRepository extends JpaRepository<ItemGrp, String> {

    List<ItemGrp> findByItemGrpCdContainsOrItemGrpNmContains(String itemGroupCode, String itemGrpName);

}
