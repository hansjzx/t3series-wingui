package com.zionex.t3series.web.domain.bf.abcanalysis;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface ABCAnalysisRepository extends JpaRepository<ABCAnalysis, String> {
    
    @Query("SELECT a FROM ABCAnalysis a WHERE UPPER(a.itemCd) like UPPER(:itemCd) ESCAPE '\\' AND UPPER(a.accountCd) like UPPER(:accountCd) ESCAPE '\\'")
    List<ABCAnalysis> findByUsernameAndDisplayName(String itemCd, String accountCd);

    @Modifying
    @Transactional
    @Query("UPDATE ABCAnalysis a SET a.activeYN = 'N'")
    void setDeactive();

    @Modifying
    @Transactional
    @Query("delete from ABCAnalysis a")
    void truncate();
}