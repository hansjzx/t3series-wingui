package com.zionex.t3series.web.domain.fp.bor;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BorRepository extends JpaRepository<Bor, String> {
    
    List<Bor> findByRoute_RouteCd(String routeCode);

    List<Bor> findByResource_ResourceCd(String resourceCode);

}
