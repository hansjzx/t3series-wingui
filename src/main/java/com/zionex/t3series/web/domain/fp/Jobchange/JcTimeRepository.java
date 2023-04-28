package com.zionex.t3series.web.domain.fp.Jobchange;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JcTimeRepository extends JpaRepository<JcTime, String> {

    List<JcTime> findByResource_ResourceCdContains(String searchResource);

}
