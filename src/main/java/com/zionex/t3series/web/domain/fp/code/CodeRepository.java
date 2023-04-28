package com.zionex.t3series.web.domain.fp.code;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("fpCodeRepository")
public interface CodeRepository extends JpaRepository<Code, String> {

    List<Code> findByCodeGroupCdOrderByCodeSeq(String codeGroupCd);

}
