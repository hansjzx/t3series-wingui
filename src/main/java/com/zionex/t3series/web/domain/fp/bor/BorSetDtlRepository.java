package com.zionex.t3series.web.domain.fp.bor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorSetDtlRepository extends JpaRepository<BorSetDtl, String> {

    BorSetDtl findTop1ByRoute_RouteCdAndResource_ResourceCdOrderByBorSetMst_BorSetCdDesc(String routeCode, String resourceCd);

    List<BorSetDtl> findByRoute_RouteCdOrderByBorSetMst_BorSetCdAsc(String routeCode);

    @Query("select r from BorSetDtl r " +
            "where (r.route.routeCd like %?1% or r.route.routeNm like %?1%) " +
            "and (r.resource.resourceCd like %?2% or r.resource.resourceNm like %?2%) ")
    List<BorSetDtl> getBorSetDtls(String searchRoute, String searchResource);

}
