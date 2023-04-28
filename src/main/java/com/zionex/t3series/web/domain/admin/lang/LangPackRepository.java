package com.zionex.t3series.web.domain.admin.lang;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LangPackRepository extends JpaRepository<LangPack, LangPackPK> {

    LangPack findByLangCdAndLangKey(String langCd, String langKey);

    List<LangPack> findByLangCd(String langCd);

}
