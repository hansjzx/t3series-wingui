package com.zionex.t3series.web.domain.im.gradetarget;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/inventoryplan/grade-target")
public class ImGradeTargetController {

    private final ImGradeTargetService imGradeTargetService;

    @PostMapping("")
    public Page<ItemMst> getGradeTargetData(@RequestParam("ITEM_CD") String itemCd, @RequestParam("ITEM_NM") String itemNm, @RequestParam("ITEM_TP") String itemTp,
            @RequestParam("PAGE") int page, @RequestParam("SIZE") int size) {
        return imGradeTargetService.getGradeTargetData(itemCd, itemNm, itemTp, page, size);
    }
}
