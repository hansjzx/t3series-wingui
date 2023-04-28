package com.zionex.t3series.web.domain.fp.plan;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VersionPlantRepository extends JpaRepository<VersionPlant, String> {

    List<VersionPlant> findByVersionCd(String versionCd);

}
