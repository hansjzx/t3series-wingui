package com.zionex.t3series.web.domain.fp.resource;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ResrcUtilizationRepository extends JpaRepository<ResrcUtilization, String> {

    List<ResrcUtilization> findByVersionCdAndPlant_PlantCdInAndStartTsBetween(String versionCd, List<String> plantCds, LocalDateTime startTs, LocalDateTime endTs);

    List<ResrcUtilization> findByVersionCdInAndStartTsBetweenOrderByVersionCd(List<String> versionCds, LocalDateTime startTs, LocalDateTime endTs);
    
}
