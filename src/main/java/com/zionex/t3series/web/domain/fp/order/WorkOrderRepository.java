package com.zionex.t3series.web.domain.fp.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, String> {

    List<WorkOrder> findByWoCdContains(String workOrderCode);

    List<WorkOrder> findAllByOrderByWoCd();

}
