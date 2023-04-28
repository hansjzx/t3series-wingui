package com.zionex.t3series.web.domain.fp.resource;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, String> {

    List<Resource> findByResourceCdContainsOrResourceNmContainsOrDescTxtContains(String resourceCd, String resourceNm, String descTxt);

    @Query("select r from Resource r where (r.resourceCd like %?1% or r.resourceNm like %?2%) order by r.toolResourceYn asc, r.resourceCd asc")
    List<Resource> findResources(String resourceCd, String resourceNm);

    @Query("select r from Resource r where (r.resourceCd like %?1% or r.resourceNm like %?2%) and r.toolResourceYn = ?3 order by r.resourceCd asc")
    List<Resource> findToolResources(String resourceCd, String resourceNm, Boolean isTool);

    Resource findTop1ByResourceCd(String resourceCd);

}
