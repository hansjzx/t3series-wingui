package com.zionex.t3series.web.domain.fp.order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderTypeRepository extends JpaRepository<OrderType, String> {

    List<OrderType> findByOrderTpCdContains(String orderTypeCode);
}
