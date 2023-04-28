package com.zionex.t3series.web.domain.fp.bor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ToolSupplyRepository extends JpaRepository<ToolSupply, String> {

    List<ToolSupply> findByResource_ResourceCdOrderBySupplyTsAsc(String toolResourceCode);
    
}
