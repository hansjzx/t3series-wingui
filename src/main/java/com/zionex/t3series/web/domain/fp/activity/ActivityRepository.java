package com.zionex.t3series.web.domain.fp.activity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, String> {

    List<Activity> findByVersionCdInOrderByVersionCd(List<String> versionCds);

}
