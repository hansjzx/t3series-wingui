package com.zionex.t3series.web.domain.fp.code;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service("fpCodeService")
@RequiredArgsConstructor
public class CodeService {
    
    private final CodeRepository codeRepository;

    public List<Code> getCodesByGroupCd(String codeGroupCd) {
        return codeRepository.findByCodeGroupCdOrderByCodeSeq(codeGroupCd);
    }
    
}
