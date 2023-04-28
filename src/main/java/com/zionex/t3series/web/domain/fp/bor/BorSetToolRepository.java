package com.zionex.t3series.web.domain.fp.bor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BorSetToolRepository extends JpaRepository<BorSetTool, String> {

}
