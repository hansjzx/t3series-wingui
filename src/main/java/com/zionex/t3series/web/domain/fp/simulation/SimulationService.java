package com.zionex.t3series.web.domain.fp.simulation;

import com.zionex.t3series.web.ApplicationProperties;
import com.zionex.t3series.web.domain.admin.lang.LangPackService;
import com.zionex.t3series.web.domain.admin.user.UserService;
import com.zionex.t3series.web.domain.fp.common.CommonService;
import com.zionex.t3series.web.domain.fp.organization.Plant;
import com.zionex.t3series.web.domain.fp.organization.PlantService;
import com.zionex.t3series.web.domain.fp.plan.MainVersion;
import com.zionex.t3series.web.domain.fp.plan.MainVersionService;
import com.zionex.t3series.web.domain.fp.plan.PlanHistory;
import com.zionex.t3series.web.domain.fp.plan.PlanHistoryQueryRepository;
import com.zionex.t3series.web.domain.fp.plan.PlanHistoryService;
import com.zionex.t3series.web.domain.fp.plan.PlanPolicy;
import com.zionex.t3series.web.domain.fp.plan.PlanPolicyService;
import com.zionex.t3series.web.domain.fp.plan.PlanStepSeq;
import com.zionex.t3series.web.domain.fp.plan.PlanStepSeqService;
import com.zionex.t3series.web.domain.fp.plan.PlanVersion;
import com.zionex.t3series.web.domain.fp.plan.PlanVersionService;
import com.zionex.t3series.web.domain.fp.plan.SimulOption;
import com.zionex.t3series.web.domain.fp.plan.SimulOptionService;
import com.zionex.t3series.web.domain.fp.plan.VersionPlant;
import com.zionex.t3series.web.domain.fp.plan.VersionPlantService;
import com.zionex.t3series.web.domain.fp.setting.Setting;
import com.zionex.t3series.web.domain.fp.setting.SettingService;
import com.zionex.t3series.web.util.ResponseEntityUtil;
import com.zionex.t3series.web.util.ResponseEntityUtil.ResponseMessage;
import com.zionex.t3series.web.util.query.QueryHandler;
import com.zionex.t3simpleserver.common.ConfigurationConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import javax.persistence.ParameterMode;
import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.BinaryOperator;
import java.util.function.Function;
import java.util.stream.Collectors;

@Log
@Service
@RequiredArgsConstructor
public class SimulationService {

    private final SettingService settingService;
    private final MainVersionService mainVersionService;
    private final PlanVersionService planVersionService;
    private final LangPackService langPackService;
    private final PlanStepSeqService planStepSeqService;
    private final PlanHistoryService planHistoryService;
    private final PlanHistoryQueryRepository planHistoryQueryRepository;
    private final PlanPolicyService planPolicyService;
    private final VersionPlantService versionPlantService;
    private final PlantService plantService;
    private final SimulOptionService simulOptionService;
    private final CommonService commonService;
    private final UserService userService;
    private final QueryHandler queryHandler;

    private final ApplicationProperties applicationProperties;

    private static final String TIME_PATTERN = "HH:mm:ss";
    private static final String DATE_PATTERN = "yyyy-MM-dd";

    private static final String FP_PLAN_ZONE = "FP_PLAN_ZONE";
    private static final String FP_FREEZE_ZONE = "FP_FREEZE_ZONE";
    private static final String FP_STANDARD_START_TIME = "FP_STANDARD_START_TIME";
    private static final String FP_VERSION_CODE_PREFIX = "FP_VERSION_CODE_PREFIX";

    private static final String FP_VERSION_CODE_DATE_FORMAT = "FP_VERSION_CODE_DATE_FORMAT";
    private static final String FP_VERSION_CODE_SEQ_FORMAT = "FP_VERSION_CODE_SEQ_FORMAT";
    private static final String FP_VERSION_CODE_DELIMITER = "FP_VERSION_CODE_DELIMITER";

    private static final String FP_VERSION_CREATION = "FP_VERSION_CREATION";
    private static final String FP_SERVER_CONNECTION = "FP_SERVER_CONNECTION";

    private static final String FP_STATUS_READY = "FP_STATUS_READY";
    private static final String FP_STATUS_RUNNING = "FP_STATUS_RUNNING";
    private static final String FP_STATUS_COMPLETE = "FP_STATUS_COMPLETE";
    private static final String FP_STATUS_FAIL = "FP_STATUS_FAIL";

    private static final String FP_OPTN_NON_WORK = "FP_OPTN_NON_WORK";

    private static final String[] settingCds = { FP_PLAN_ZONE, FP_FREEZE_ZONE, FP_STANDARD_START_TIME, FP_VERSION_CODE_PREFIX, FP_VERSION_CODE_DATE_FORMAT,
            FP_VERSION_CODE_SEQ_FORMAT, FP_VERSION_CODE_DELIMITER };

    public MainVersion getVersionDefault(boolean newVersion) {
        LocalDateTime now = LocalDateTime.now();
        MainVersion lastMainVersion = mainVersionService.getLastMainVersion(now.toLocalDate());
        if (newVersion || lastMainVersion == null) {
            MainVersion mainVersion = new MainVersion();
            Map<String, String> settingMap = settingService.getSettingsBySettingCds(Arrays.asList(settingCds))
                    .stream()
                    .collect(Collectors.toMap(Setting::getSettingCd, Setting::getSettingVal));

            String standardStartTimeText = settingMap.getOrDefault(FP_STANDARD_START_TIME, now.format(DateTimeFormatter.ofPattern(TIME_PATTERN)));
            LocalTime standardStartTime = LocalTime.parse(standardStartTimeText, DateTimeFormatter.ofPattern(TIME_PATTERN));
            int planZone = Integer.parseInt(settingMap.getOrDefault(FP_PLAN_ZONE, "0"));
            int freezeZone = Integer.parseInt(settingMap.getOrDefault(FP_FREEZE_ZONE, "0"));
            mainVersion.setStartTs(LocalDateTime.of(now.toLocalDate(), standardStartTime));
            mainVersion.setEndTs(LocalDateTime.of(now.plusDays(planZone).toLocalDate(), standardStartTime));
            mainVersion.setFreezeTs(LocalDateTime.of(now.plusDays(freezeZone).toLocalDate(), standardStartTime));

            generateMainVersionCd(mainVersion);
            return mainVersion;
        } else {
            return lastMainVersion;
        }
    }

    public ResponseEntity<ResponseMessage> saveMainVersion(MainVersion mainVersion) {
        String resultMsg = langPackService.getLanguageValue("FP_MSG_SUCCESS_CREATE_VERSION");
        String versionCd = mainVersion.getMainVersionCd();
        try {
            boolean isExitsVersion = mainVersionService.existsByMainVersionCd(versionCd);
            if (isExitsVersion) {
                generateMainVersionCd(mainVersion);
                resultMsg = String.format(langPackService.getLanguageValue("FP_MSG_SUCCESS_CREATE_VERSION_DUPLICATE"), versionCd, mainVersion.getMainVersionCd());
            }
            mainVersion.setPlanDt(LocalDate.now());
            mainVersionService.saveMainVersion(mainVersion);
            return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), resultMsg));
        } catch (Exception e) {
            return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage()));
        }
    }

    public List<SimulationDetails> getSimulationDetails(String mainVersionCd) {
        MainVersion mainVersion = mainVersionService.getMainVersionByVersionCd(mainVersionCd);
        Map<Long, PlanVersion> planVersionMap = planVersionService.getPlanVersionsByMainVersionCd(mainVersionCd)
                .stream()
                .collect(Collectors.toMap(PlanVersion::getStepSeq, Function.identity(), BinaryOperator.maxBy(Comparator.comparing(PlanVersion::getVersionSeq))));
        List<PlanStepSeq> planStepSeqs = planStepSeqService.getPlanStepSeqsByStepCd(mainVersion.getStepCd());
        Map<String, PlanHistory> planHistoryMapByVersionCd = planHistoryService.getSimulationHistories()
                .stream()
                .filter(planHistory -> StringUtils.isNotEmpty(planHistory.getVersionCd()))
                .collect(Collectors.toMap(PlanHistory::getVersionCd, Function.identity()));
        Map<Long, PlanHistory> planHistoryMapByStepSeq = planHistoryService.getSimulationHistoriesByMainVersionCd(mainVersionCd)
                .stream()
                .filter(planHistory -> StringUtils.isEmpty(planHistory.getVersionCd()))
                .collect(Collectors.toMap(PlanHistory::getStepSeq, Function.identity(), BinaryOperator.maxBy(Comparator.comparing(PlanHistory::getCreatedAt))));
        List<SimulationDetails> simulationDetails = new ArrayList<>();

        for (PlanStepSeq planStepSeq : planStepSeqs) {
            SimulationDetails simulationDtls = new SimulationDetails();
            Long stepSeq = planStepSeq.getStepSeq();
            simulationDtls.setStepSeq(stepSeq);
            simulationDtls.setStepCd(planStepSeq.getStepCd());
            simulationDtls.setStepDescTxt(planStepSeq.getDescTxt());
            simulationDtls.setExecTpCd(planStepSeq.getExecTpCd());
            PlanHistory planHistory = null;
            PlanVersion planVersion = planVersionMap.get(stepSeq);
            if ("FP_EXEC_PLAN".equals(planStepSeq.getExecTpCd())) {
                if (planVersion != null) {
                    simulationDtls.setVersionCd(planVersion.getVersionCd());
                    simulationDtls.setPolicyCd(planVersion.getPolicyCd());
                    simulationDtls.setPlanDt(planVersion.getPlanDt());
                    simulationDtls.setCreatedBy(planVersion.getCreatedBy());
                    simulationDtls.setCreatedAt(planVersion.getCreatedAt());
                    simulationDtls.setVersionDescTxt(planVersion.getDescripText());
                    planHistory = planHistoryMapByVersionCd.get(planVersion.getVersionCd());
                } else {
                    simulationDtls.setStatusTpCd(FP_STATUS_READY);
                }
            } else {
                planHistory = planHistoryMapByStepSeq.get(stepSeq);
            }
            if (planHistory != null) {
                simulationDtls.setStatusTpCd(planHistory.getStatusTpCd());
                simulationDtls.setStartTs(planHistory.getStartTs());
                simulationDtls.setEndTs(planHistory.getEndTs());
            } else {
                simulationDtls.setStatusTpCd(FP_STATUS_READY);
            }
            simulationDetails.add(simulationDtls);
        }
        return simulationDetails;
    }

    @Transactional
    public ResponseEntity<ResponseMessage> savePlanVersion(PlanVersion planVersion) {
        if (checkServerStatus()) {
            String resultMsg = langPackService.getLanguageValue("FP_MSG_SUCCESS_CREATE_VERSION");
            long versionSeq = 1L;
            PlanVersion lastPlanVersion = planVersionService.getLastPlanVersionByMainVersionCd(planVersion.getMainVersionCd());
            if (lastPlanVersion != null) {
                versionSeq = lastPlanVersion.getVersionSeq() + 1;
            }
            String versionCd = planVersion.getMainVersionCd() + "-" + String.format("%03d", versionSeq);
            try {
                planVersion.setVersionCd(versionCd);
                planVersion.setVersionSeq(versionSeq);
                planVersion.setPlanDt(LocalDate.now());
                planVersionService.savePlanVersion(planVersion);

                List<VersionPlant> versionPlants = new ArrayList<>();
                List<Plant> plants = plantService.getPlants();
                for (Plant plant : plants) {
                    VersionPlant versionPlant = new VersionPlant();
                    versionPlant.setVersionCd(versionCd);
                    versionPlant.setPlant(plant);
                    versionPlants.add(versionPlant);
                }
                versionPlantService.saveVersionPlants(versionPlants);
                return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), resultMsg, versionCd));
            } catch (Exception e) {
                return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(), langPackService.getLanguageValue("FP_MSG_FAIL_VERSION_SAVE"), FP_VERSION_CREATION));
            }
        }
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(), langPackService.getLanguageValue("FP_MSG_NO_CONNECT_SERVER"), FP_SERVER_CONNECTION));
    }

    public void createOrUpdatePlanHistory(String versionCd, String statusTpCd, String statusLog) {
        PlanVersion planVersion = planVersionService.getPlanVersionByVersionCd(versionCd);
        PlanHistory planHistory = planHistoryService.getPlanHistoryByVersionCd(versionCd);
        PlanStepSeq planStepSeq = planStepSeqService.getPlanStepSeqByStepCdAndSeq(planVersion.getStepCd(), planVersion.getStepSeq());
        LocalDateTime now = LocalDateTime.now();
        if (planHistory == null) {
            planHistory = new PlanHistory();
            planHistory.setMainVersionCd(planVersion.getMainVersionCd());
            planHistory.setVersionCd(versionCd);
            planHistory.setStepCd(planVersion.getStepCd());
            planHistory.setStepSeq(planVersion.getStepSeq());
            planHistory.setDescTxt(planStepSeq.getDescTxt());
            planHistory.setStartTs(now);
        }
        planHistory.setEndTs(now);
        planHistory.setStatusTpCd(statusTpCd);
        planHistory.setStatusLog(statusLog);
        planHistoryService.savePlanHistory(planHistory);
    }

    public List<SimulationHistory> getSimulationHistories() {
        return planHistoryQueryRepository.getSimulationHistories();
    }

    public ResponseEntity<ResponseMessage> executePlan(PlanVersion planVersion) {
        String policyCd = planVersion.getPolicyCd();
        String versionCd = planVersion.getVersionCd();
        PlanPolicy planPolicy = planPolicyService.getPlanPolicyByPolicyCd(policyCd);
        String scriptNm = planPolicy.getScriptNm();
        String userName = userService.getUserDetails().getUsername();

        try {
            createOrUpdatePlanHistory(versionCd, FP_STATUS_RUNNING, null);
            String fpServerUrl = applicationProperties.getServer().get("fp").createUrl();
            WebClient webClient = WebClient.builder()
                    .baseUrl(fpServerUrl + "/factoryplan/")
                    .build();

            webClient.post()
                    .uri("plan/{version-cd}/{script-file-name}/{username}", versionCd, scriptNm, userName)
                    .contentType(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .onStatus(HttpStatus::is4xxClientError, response -> response
                            .bodyToMono(Map.class)
                            .flatMap(body -> Mono.error(new RuntimeException((String)body.get("message")))))
                    .onStatus(HttpStatus::is5xxServerError, response -> response
                            .bodyToMono(Map.class)
                            .flatMap(body -> Mono.error(new RuntimeException((String)body.get("message")))))
                    .bodyToMono(Void.class)
                    .block();

            createOrUpdatePlanHistory(versionCd, FP_STATUS_COMPLETE, null);
            return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), langPackService.getLanguageValue("MSG_0001")));
        } catch (Exception e) {
            log.severe(e.getMessage());
            createOrUpdatePlanHistory(planVersion.getVersionCd(), FP_STATUS_FAIL, e.getMessage());
            return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage()));
        }
    }

    @SuppressWarnings("unchecked")
    public ResponseEntity<ResponseMessage> executeProcedure(String mainVersionCd, String stepCd, Long stepSeq) {
        if (checkServerStatus()) {
            PlanHistory planHistory = createPlanHistoryInProcedure(mainVersionCd, stepCd, stepSeq);

            try {
                String userName = userService.getUserDetails().getUsername();
                PlanStepSeq planStepSeq = planStepSeqService.getPlanStepSeqByStepCdAndSeq(stepCd, stepSeq);
                String target = planStepSeq.getExecTarget();

                Map<String, Object> params = new HashMap<>();
                params.put("P_USERNAME", new Object[] { userName, String.class, ParameterMode.IN });
                params.put("P_RT_ROLLBACK_FLAG", new Object[] { null, String.class, ParameterMode.OUT });
                params.put("P_RT_MSG", new Object[] { null, String.class, ParameterMode.OUT });

                List<Map<String, Object>> procedureResult = (List<Map<String, Object>>) queryHandler.getProcedureData(target, null, params);
                Map<String, Object> resultMap = procedureResult.get(0);
                boolean resultFlag = Boolean.parseBoolean((String) resultMap.get("P_RT_ROLLBACK_FLAG"));
                String resultMsg = (String) resultMap.get("P_RT_MSG");

                if (resultFlag) {
                    updatePlanHistoryInProcedure(planHistory, FP_STATUS_COMPLETE, null);
                    return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), resultMsg));
                } else {
                    log.severe(resultMsg);
                    updatePlanHistoryInProcedure(planHistory, FP_STATUS_FAIL, resultMsg);
                    return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(), resultMsg));
                }
            } catch (Exception e) {
                log.severe(e.getMessage());
                updatePlanHistoryInProcedure(planHistory, FP_STATUS_FAIL, e.getMessage());
                return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage()));
            }
        }

        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(), langPackService.getLanguageValue("FP_MSG_NO_CONNECT_SERVER"), FP_SERVER_CONNECTION));
    }

    private PlanHistory createPlanHistoryInProcedure(String mainVersionCd, String stepCd, Long stepSeq) {
        PlanStepSeq planStepSeq = planStepSeqService.getPlanStepSeqByStepCdAndSeq(stepCd, stepSeq);
        LocalDateTime now = LocalDateTime.now();
        PlanHistory planHistory = new PlanHistory();
        planHistory.setMainVersionCd(mainVersionCd);
        planHistory.setStepCd(stepCd);
        planHistory.setStepSeq(stepSeq);
        planHistory.setDescTxt(planStepSeq.getDescTxt());
        planHistory.setStartTs(now);
        planHistory.setStatusTpCd(FP_STATUS_RUNNING);
        return planHistoryService.savePlanHistory(planHistory);
    }

    private void updatePlanHistoryInProcedure(PlanHistory planHistory, String statusTpCd, String statusLog) {
        LocalDateTime now = LocalDateTime.now();
        planHistory.setStatusTpCd(statusTpCd);
        planHistory.setStatusLog(statusLog);
        planHistory.setEndTs(now);
        planHistoryService.savePlanHistory(planHistory);
    }

    public List<SimulOption> getSimulationOptions(String planVersionCd) {
        List<SimulOption> simulOptions = simulOptionService.getSimulOptionsByVersionCd(planVersionCd);
        for (SimulOption simulOption: simulOptions) {
            if (FP_OPTN_NON_WORK.equals(simulOption.getCategoryCd())) {
                String[] nonWork = simulOption.getOptnVal().split(", ");
                Arrays.sort(nonWork);
                simulOption.setOptnVal((nonWork.length > 1) ? nonWork[0] + "~" + nonWork[nonWork.length - 1] : nonWork[0]);
            }
        }
        return simulOptions;
    }

    public ResponseEntity<ResponseMessage> saveSimulationOptions(List<SimulOption> simulOptions) {
        Map<String, SimulOption> simulOptionMap = simulOptionService.getSimulOptionsByVersionCd(simulOptions.get(0).getVersionCd())
                .stream()
                .collect(Collectors.toMap(SimulOption::getCategoryCd, Function.identity()));
        List<SimulOption> saveSimulOptions = new ArrayList<>();
        try {
            for (SimulOption simulOption: simulOptions) {
                if (FP_OPTN_NON_WORK.equals(simulOption.getCategoryCd())) {
                    if (StringUtils.isNotEmpty(simulOption.getOptnVal())) {
                        simulOption.setOptnVal(makeDateRangeString(simulOption.getOptnVal()));
                    }
                }
                SimulOption existSimulOption = simulOptionMap.get(simulOption.getCategoryCd());
                if (existSimulOption != null) {
                    existSimulOption.setCategoryCd(simulOption.getCategoryCd());
                    existSimulOption.setOptnVal(simulOption.getOptnVal());
                    saveSimulOptions.add(existSimulOption);
                } else {
                    saveSimulOptions.add(simulOption);
                }
            }
            simulOptionService.saveSimulOptions(saveSimulOptions);
            return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), langPackService.getLanguageValue("MSG_0001")));
        } catch (Exception e) {
            return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage()));
        }
    }

    private boolean checkServerStatus() {
        Map<String, Object> fpServerStatus = commonService.getServerStatus();
        return (boolean) fpServerStatus.get(ConfigurationConstants.ELEMENT_CONNECTION);
    }

    private void generateMainVersionCd(MainVersion mainVersion) {
        long versionSeq = 1L;
        MainVersion lastMainVersion = mainVersionService.getLastMainVersion(LocalDate.now());
        if (lastMainVersion != null) {
            versionSeq = lastMainVersion.getVersionSeq() + 1;
        }

        Map<String, String> settingMap = settingService.getSettingsBySettingCds(Arrays.asList(settingCds))
                .stream()
                .collect(Collectors.toMap(Setting::getSettingCd, Setting::getSettingVal));

        String versionCd = settingMap.get(FP_VERSION_CODE_PREFIX)
                + settingMap.get(FP_VERSION_CODE_DELIMITER)
                + toFormat(LocalDateTime.now(), settingMap.get(FP_VERSION_CODE_DATE_FORMAT))
                + settingMap.get(FP_VERSION_CODE_DELIMITER)
                + String.format("%0" + settingMap.get(FP_VERSION_CODE_SEQ_FORMAT) + "d", versionSeq);
        mainVersion.setMainVersionCd(versionCd);
        mainVersion.setVersionSeq(versionSeq);
    }

    private String makeDateRangeString(String startEndDate) {
        String[] dates = startEndDate.split("~");
        LocalDate startDate = LocalDate.parse(dates[0], DateTimeFormatter.ofPattern(DATE_PATTERN));
        LocalDate endDate = LocalDate.parse(dates[1], DateTimeFormatter.ofPattern(DATE_PATTERN));
        List<String> dateRangeString = new ArrayList<>();
        endDate = endDate.plusDays(1);
        for (LocalDate date = startDate; date.isBefore(endDate); date = date.plusDays(1)) {
            String dateString = date.format(DateTimeFormatter.ofPattern(DATE_PATTERN));
            dateRangeString.add(dateString);
        }
        return String.join(", ", dateRangeString);
    }

    public String toFormat(LocalDateTime target, String pattern) {
        return target.format(DateTimeFormatter.ofPattern(pattern));
    }

}
