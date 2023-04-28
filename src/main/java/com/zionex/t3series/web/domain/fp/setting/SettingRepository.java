package com.zionex.t3series.web.domain.fp.setting;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SettingRepository extends JpaRepository<Setting, String> {
    
    List<Setting> findBySettingCdIn(List<String> settingCds);
    
    Setting findBySettingCd(String settingCd);
    
}
