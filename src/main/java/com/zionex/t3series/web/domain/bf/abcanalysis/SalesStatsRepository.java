package com.zionex.t3series.web.domain.bf.abcanalysis;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SalesStatsRepository extends JpaRepository<SalesStats, String> {

    @Query("select distinct a.thldA as gradeA, a.thldB as gradeB, a.thldX as gradeX, a.thldY as gradeY from SalesStats a")
    Map<String, Object> findAllDistinctData();
}