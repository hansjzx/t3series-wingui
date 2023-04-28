package com.zionex.t3series.web.domain.fp.master;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ValidationMaster {

    private String validationType;
    private int errorCount;
    private List<Detail> details;

    @Data
    public static class Detail {
        private String validationType;
        private String langKey;
        private int errorCount;
        private List<Model> models;
    }

    @Data
    public static class Model {
        private String model;
        private String modelCode;
        private String modelName;

        private String createdBy;
        private LocalDateTime createdAt;
        private String updatedBy;
        private LocalDateTime updatedAt;
    }

}
