package com.zionex.t3series.web.domain.engine.license;

import static org.quartz.CronScheduleBuilder.cronSchedule;
import static org.quartz.JobBuilder.newJob;
import static org.quartz.TriggerBuilder.newTrigger;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.impl.StdSchedulerFactory;

import com.zionex.t3simpleserver.common.ApplicationConstants;
import com.zionex.t3platform.common.ServiceConstants;
import com.zionex.t3platform.message.MessageOperator;
import com.zionex.t3platform.message.MessageOperator.MessageType;
import com.zionex.t3series.license.ExpectedValueAbstract;
import com.zionex.t3series.license.ExpireLicenseItem;
import com.zionex.t3series.license.LicenseChecker;
import com.zionex.t3series.license.LicenseException;
import com.zionex.t3series.license.LicenseItem;
import com.zionex.t3series.util.DateUtil;
import com.zionex.t3series.util.NumberUtil;
import com.zionex.t3series.web.domain.engine.PlatformService;
import com.zionex.t3simpleserver.T3SimpleServer;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LicenseManager {

    public static final String LICENSE_MANAGER = "LICENSE_MANAGER";
    private final String filePath;
    private String errorMessage;
    private String expireDate;
    private Set<String> internalServers;
    private static final Set<String> excludeLicenseProducts = new HashSet<>(Arrays.asList("T3SeriesFP", "T3SeriesMP"));

    private LicenseChecker checker;
    private final PlatformService adapter;
    private Scheduler scheduler;
    private LicenseFileWatcher fileWatcher;
    private final LicenseGenerator licenseGenerator;

    // key: server id, value: (key: license item key, value: license item value)
    private final Map<String, Map<String, String>> licensePossessionInfos = new HashMap<>();

    // key: server id, value: (key: license item key, value: license item value)
    private final Map<String, Map<String, String>> serverLicenseInfos = new HashMap<>();

    // key: server id, value: ExpectedValueAbstract
    private final Map<String, ExpectedValueAbstract> expectedValueInfos = new HashMap<>();

    // key: server id, value: list [0:server id, 1:license status, 2:expire date, 3:message]
    private final Map<String, List<Object>> licenseResultInfos = new HashMap<>();

    private static final Lock lock = new ReentrantLock(true);

    public LicenseManager(PlatformService adapter, String filePath) {
        this.adapter = adapter;
        this.filePath = filePath;

        licenseGenerator = new LicenseGenerator(this, adapter);

        setInternalServer(adapter.getId());
        initialize();
    }

    private void initialize() {
        log.info("LicenseManager is initializing.");

        try {
            checker = new LicenseChecker(
                    filePath + ApplicationConstants.FILE_LICENSE_XML,
                    filePath + ApplicationConstants.FILE_LICENSE_BIN);

            licensePossessionInfos.putAll(checker.getLicenseConfigValues());

            boolean isSuccess = checker.checkLicenseSignature();
            if (!isSuccess) {
                String message = "NOMATCH : signature file is not matched";
                log.warn(message);
                setLicenseErrorMessage(message);
            }

            registerScheduler();

        } catch (IOException | LicenseException e) {
            log.warn(e.getMessage());
            setLicenseErrorMessage(e.getMessage());
        }

        if (fileWatcher == null) {
            fileWatcher = new LicenseFileWatcher(this, filePath);
            fileWatcher.start();
        }
    }

    private void registerScheduler() {
        if (licensePossessionInfos.isEmpty()) {
            return;
        }

        for (Map<String, String> map : licensePossessionInfos.values()) {
            expireDate = map.get(LicenseChecker.KEY_EXPIREDATE);
            break;
        }

        try {
            if (!expireDate.equals(LicenseChecker.VALUE_UNLIMITED)) {
                if (scheduler != null && scheduler.isStarted()) {
                    scheduler.shutdown();
                    scheduler = null;
                }

                Date expire = DateUtil.toDate(expireDate);
                Date current = new Date();
                if (expire.before(current)) {
                    return;
                }

                scheduler = StdSchedulerFactory.getDefaultScheduler();

                JobKey jobKey = new JobKey(DynamicItemValidatorJob.DYNAMIC_ITEM_VALIDATOR);
                JobDetail job = newJob(DynamicItemValidatorJob.class)
                          .withIdentity(jobKey)
                          .build();

                Trigger trigger = newTrigger()
                          .withIdentity(jobKey.getName())
                          .withSchedule(cronSchedule(convertPattern(expireDate)))
                          .build();

                job.getJobDataMap().put(DynamicItemValidatorJob.LICENSE_CHECKER, checker);
                job.getJobDataMap().put(LicenseManager.LICENSE_MANAGER, this);

                scheduler.scheduleJob(job, trigger);
                scheduler.start();
            }

        } catch (SchedulerException e) {
            log.error(e.getMessage());
        }
    }

    private String convertPattern(String expireDate) {
        String[] str = expireDate.split("-");
        int year = NumberUtil.toInteger(str[0]);
        int month = NumberUtil.toInteger(str[1]);
        int day = NumberUtil.toInteger(str[2]);

        return "0 0 0 " + day + " " + month + " ? " + year;
    }

    public boolean checkLicense(String serverId) throws Exception {
        lock.lock();
        try {
            log.info("{} License checking...", serverId);

            if (licensePossessionInfos.isEmpty()) {
                log.warn("{} License validation: Failed", serverId);
                return false;
            }

            if (licenseResultInfos.containsKey(serverId)) {
                List<Object> resultInfo = licenseResultInfos.get(serverId);
                if (ServiceConstants.RESULT_MESSAGE_SUCCESS == resultInfo.get(1)) {
                    log.info("{} License validation : OK", serverId);
                    if (!checker.isExpirationRemains(15) && expireDate != null) {
                        log.warn("License Expire Date : {}", expireDate);
                    }
                    return true;
                }
            }

            ExpectedValueAbstract licenseValues = expectedValueInfos.get(serverId);
            boolean isValid = checker.checkLicense(licenseValues, serverId);
            if (isValid) {
                log.info("{} License validation : OK", serverId);
                if (!checker.isExpirationRemains(15) && expireDate != null) {
                    log.warn("License Expire Date : {}", expireDate);
                }
            }

            return isValid;

        } finally {
            lock.unlock();
        }
    }

    public void setLicenseConfirmResult(String serverId, boolean isValid) {
        List<Object> row = new ArrayList<>();
        if (isValid) {
            row.add(serverId);
            row.add(ServiceConstants.RESULT_MESSAGE_SUCCESS);
            row.add(expireDate);
            row.add("");

        } else {
            row.add(serverId);
            row.add(ServiceConstants.RESULT_MESSAGE_FAIL);
            row.add(expireDate);
            row.add(getLicenseErrorMessage(serverId));
        }

        licenseResultInfos.put(serverId, row);
    }

    public void licenseFileChanged() {
        errorMessage = null;
        licensePossessionInfos.clear();
        licenseResultInfos.clear();

        initialize();

        List<String> targetServers = getTargetServer();
        Map<String, Object> contents = new HashMap<>();
        log.debug("licenseFileChanged targetServers : {}", targetServers);

        for (String serverId : targetServers) {
            Map<String, Object> message = MessageOperator.makeMessage(MessageType.request.toString(), adapter.getId(),
                    serverId, T3SimpleServer.ReservedService.InitializeLicense.toString(), "request to initialize license", contents);
            adapter.getEngineAdaptor().doSyncService(message);
        }
    }

    public List<Object> getLicenseResultInfo(String serverId) {
        if (!licenseResultInfos.containsKey(serverId)) {
            validateLicense(serverId);
        }

        return licenseResultInfos.get(serverId);
    }

    public void validateLicense(String serverId) {
        try {
            if (!hasServerLicenseInfo(serverId)) {
                Map<String, String> licenseValues = licenseGenerator.getLicenseValues(serverId);
                setExpectedValueInfo(serverId, licenseValues);
            }

            boolean isValid = checkLicense(serverId);
            setLicenseConfirmResult(serverId, isValid);

        } catch (Exception e) {
            List<Object> row = new ArrayList<>();
            row.add(serverId);
            row.add(ServiceConstants.RESULT_MESSAGE_FAIL);
            row.add(expireDate);
            row.add(e.getMessage());
            licenseResultInfos.put(serverId, row);
        }
    }

    public Map<String, String> getLicensePossessionInfo(String serverId) {
        if (licensePossessionInfos.isEmpty()) {
            return Collections.emptyMap();
        }

        if (!licensePossessionInfos.containsKey(serverId)) {
            String unlimitedServer = LicenseChecker.VALUE_UNLIMITED;
            if (licensePossessionInfos.containsKey(unlimitedServer)) {
                return Collections.unmodifiableMap(licensePossessionInfos.get(unlimitedServer));
            }

            return Collections.emptyMap();
        }

        return Collections.unmodifiableMap(licensePossessionInfos.get(serverId));
    }

    public void setInternalServer(String serverId) {
        if (internalServers == null) {
            internalServers = new HashSet<>();
        }

        internalServers.add(serverId);
    }

    public boolean hasServerLicenseInfo(String serverId) {
        return serverLicenseInfos.containsKey(serverId);
    }

    public Map<String, String> getServerLicenseInfo(String serverId) {
        if (serverLicenseInfos.isEmpty()) {
            return Collections.emptyMap();
        }

        return serverLicenseInfos.get(serverId);
    }

    public void setExpectedValueInfo(String serverId, Map<String, String> serverLicenseValues) {
        if (expectedValueInfos.containsKey(serverId)) {
            return;
        }

        try {
            ExpectedValueAbstract licenseValues = new ServerLicenseInfo(serverLicenseValues);
            expectedValueInfos.put(serverId, licenseValues);

            Map<String, String> serverLicenseInfo = new HashMap<>();
            List<LicenseItem> expectedValues = licenseValues.getServerExpectedValues();
            for (LicenseItem item : expectedValues) {
                serverLicenseInfo.put(item.getKey(), item.getValue());
            }

            if (!serverLicenseInfo.isEmpty() && !serverLicenseInfos.containsKey(serverId)) {
                serverLicenseInfos.put(serverId, serverLicenseInfo);
            }

        } catch (Exception e) {
            log.warn("cannot find license value of {}", serverId);

        }
    }

    public String getLicenseErrorMessage(String serverId) {
        if (errorMessage != null) {
            return errorMessage;
        }

        if (licenseResultInfos.containsKey(serverId)) {
            List<Object> resultInfo = licenseResultInfos.get(serverId);
            if (ServiceConstants.RESULT_MESSAGE_FAIL == resultInfo.get(1)) {
                return (String)resultInfo.get(3);
            }
        }

        ExpectedValueAbstract licenseValues = expectedValueInfos.get(serverId);
        return checker.getLicenseErrorMessage(licenseValues);
    }

    private void setLicenseErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public Map<String, String> getDynamicValues() {
        Map<String, String> dynamicValues = new HashMap<>();
        dynamicValues.put(LicenseChecker.KEY_EXPIREDATE, expireDate);
        return dynamicValues;
    }

    public List<LicenseItem> getDynamicItems() {
        List<LicenseItem> licenseItems = new ArrayList<>();
        licenseItems.add(new ExpireLicenseItem(LicenseChecker.KEY_EXPIREDATE, LicenseChecker.VALUE_UNLIMITED));
        return licenseItems;
    }

    public List<String> getTargetServer() {
        return getNeedLicenseCheckServers();
    }

    private List<String> getNeedLicenseCheckServers() {
        if (adapter == null) {
            return Collections.emptyList();
        }

        List<String> needLicenseCheckServers = new ArrayList<>();

        Set<String> registeredServerKeys = adapter.getRegisteredServerIds();
        for (String serverId : registeredServerKeys) {
            // Map<String, String> licenseValues;

            // try {
            //     if (hasServerLicenseInfo(serverId)) {
            //         licenseValues = getServerLicenseInfo(serverId);
            //     } else {
            //         licenseValues = licenseGenerator.getLicenseValues(serverId);
            //     }
            // } catch (Exception e) {
            //     log.warn(e.getMessage());
            //     continue;
            // }

            if (excludeLicenseProducts.contains(serverId)) {
                continue;
            }

            needLicenseCheckServers.add(serverId);
        }

        return needLicenseCheckServers;
    }

    public LicenseGenerator getLicenseGenerator() {
        return licenseGenerator;
    }

}
