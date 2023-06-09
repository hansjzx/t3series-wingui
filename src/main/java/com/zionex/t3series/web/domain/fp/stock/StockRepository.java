package com.zionex.t3series.web.domain.fp.stock;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockRepository extends JpaRepository<Stock, String> {

    List<Stock> findByStockCdContainsOrDescTxtContains(String stockCd, String descTxt);

}
