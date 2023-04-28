package com.zionex.t3series.web.domain.fp.order;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, String> {

    List<SalesOrder> findBySoCdContains(String salesOrderCode);

}
