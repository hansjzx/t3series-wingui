package com.zionex.t3series.web.domain.fp.order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WoPlanRepository extends JpaRepository<WoPlan, String> {

    List<WoPlan> findByVersionCdAndPlantCdIn(String versionCd, List<String> plantCds);

    List<WoPlan> findByVersionCdInOrderByVersionCd(List<String> versionCds);

}
