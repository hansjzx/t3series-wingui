package com.zionex.t3series.web.domain.im.gradetarget;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImGradeTargetService {

    private final ImGradeTargetQueryRepository mpPaginationRepository;

    public Page<ItemMst> getGradeTargetData(String itemCd, String itemNm, String itemTp, int page, int size) {

        return mpPaginationRepository.getGradeTargetData(itemCd, itemNm, itemTp, PageRequest.of(page, size));
    }
}
