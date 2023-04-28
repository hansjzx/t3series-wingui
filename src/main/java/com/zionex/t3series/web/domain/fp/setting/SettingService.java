package com.zionex.t3series.web.domain.fp.setting;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SettingService {
    
    private final SettingRepository settingRepository;
    
    public List<Setting> getSettingsBySettingCds(List<String> settingCds) {
        return settingRepository.findBySettingCdIn(settingCds);
    }
    
    public Setting getSettingBySettingCd(String settingCd) {
        return settingRepository.findBySettingCd(settingCd);
    }
    
}
