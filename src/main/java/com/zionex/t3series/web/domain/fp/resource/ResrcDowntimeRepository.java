package com.zionex.t3series.web.domain.fp.resource;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResrcDowntimeRepository extends JpaRepository<ResrcDowntime, String> {

    List<ResrcDowntime> findByVersionCdAndPlantCdInOrderByPlantCdAscResourceCdAscStageCdAscEndTsAsc(String versionCd, List<String> plantCds);

}
