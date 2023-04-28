package com.zionex.t3series.web.domain.fp.stock;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WoStockAssignRepository extends JpaRepository<WoStockAssign, String>  {

}
