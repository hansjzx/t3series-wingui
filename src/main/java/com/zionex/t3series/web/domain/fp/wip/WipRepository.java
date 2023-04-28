package com.zionex.t3series.web.domain.fp.wip;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WipRepository extends JpaRepository<Wip, String> {

    List<Wip> findByRoute_RouteCdContainsOrRoute_RouteNmContainsOrderByRoute_RouteCd(String routeCd, String routeNm);

    Wip findTop1ByOrderByWipIdDesc();

}
