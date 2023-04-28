package com.zionex.t3series.web.domain.fp.plan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SimulOptionRepository extends JpaRepository<SimulOption, String> {
    
    List<SimulOption> findByVersionCd(String versionCd);
    
}
