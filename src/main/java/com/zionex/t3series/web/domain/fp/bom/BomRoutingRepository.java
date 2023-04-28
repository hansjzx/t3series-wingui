package com.zionex.t3series.web.domain.fp.bom;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BomRoutingRepository extends JpaRepository<BomRouting, String> {

    List<BomRouting> findByBomTpCdAndInventory_inventoryCd(String bomTypeCode, String inventoryCode);

    List<BomRouting> findByBomTpCdAndRoute_RouteCd(String bomTypeCode, String routeCode);

    List<BomRouting> findByBomTpCd(String bomTypeCode);

}
