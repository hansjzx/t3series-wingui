package com.zionex.t3series.web.domain.fp.route;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, String> {

    @Query("select r from Route r where r.routeCd like %?1% order by r.routeCd asc")
    List<Route> findByRouteCdContains(String routeCd);

    Route findTop1ByRouteCd(String routeCd);

}
