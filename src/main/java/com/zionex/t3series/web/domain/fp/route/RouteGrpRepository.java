package com.zionex.t3series.web.domain.fp.route;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteGrpRepository extends JpaRepository<RouteGrp, String> {

    @Query("select r from RouteGrp r where r.routeGrpCd like %?1% order by r.routeGrpCd asc")
    List<RouteGrp> findByRouteGrpCdContains(String routeGrpCd);

}
