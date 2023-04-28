package com.zionex.t3series.web.domain.fp.Jobchange;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JcTimeGrpRepository extends JpaRepository<JcTimeGrp, String> {

    List<JcTimeGrp> findByResource_ResourceCdContains(String searchResource);

}
