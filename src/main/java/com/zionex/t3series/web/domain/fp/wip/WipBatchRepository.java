package com.zionex.t3series.web.domain.fp.wip;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WipBatchRepository extends JpaRepository<WipBatch, String> {
}
