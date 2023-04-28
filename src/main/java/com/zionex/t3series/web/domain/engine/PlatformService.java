package com.zionex.t3series.web.domain.engine;

import com.zionex.t3platform.common.ServiceConstants;
import com.zionex.t3platform.message.MessageOperator;
import com.zionex.t3platform.message.MessageOperator.MessageType;
import com.zionex.t3series.framework.configuration.Configuration;
import com.zionex.t3series.framework.configuration.ConfigurationBuilder;
import com.zionex.t3series.license.LicenseItem;
import com.zionex.t3series.util.NetworkUtil;
import com.zionex.t3series.web.ApplicationProperties;
import com.zionex.t3series.web.domain.engine.license.*;
import com.zionex.t3simpleserver.T3SimpleServer;
import com.zionex.t3simpleserver.T3SimpleServerAbstract;
import com.zionex.t3simpleserver.common.ConfigurationConstants;
import com.zionex.t3simpleserver.license.ServerLicenseValue;
import com.zionex.t3simpleserver.resultprovider.ResultTypeIMProvider;
import com.zionex.t3simpleserver.resultprovider.ResultTypeITC1Provider;
import com.zionex.t3simpleserver.service.ServiceInfo;
import com.zionex.t3simpleserver.service.ServiceManager;
import com.zionex.t3simpleserver.service.ServiceWorkerEntry;
import com.zionex.t3simpleserver.util.Environments;
import com.zionex.t3simpleserver.worker.SingleInformationContainer;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.*;

@Slf4j
@Component
public class PlatformService extends T3SimpleServerAbstract {

    public static final String PRODUCT = "T3Platform";
    public static final String VERSION = "22.1.1";

    public static final String SERVER_PLATFORM = "T3SeriesPlatform";
    public static final String SERVER_LICENSE = "LicenseServer";

    public static final String MISSING_CONFIGURATION = "MISSING_CONFIGURATION";

    private boolean isCloudEnv = false;

    @Autowired
    private EngineAdaptor engineAdaptor;

    public EngineAdaptor getEngineAdaptor() {
        return engineAdaptor;
    }

    @Autowired
    private ApplicationProperties applicationProperties;

    @Value("${server.port}")
    private int port;

    private String licensePath;

    public PlatformService() {
        super(MISSING_CONFIGURATION, SERVER_PLATFORM);
    }

    @PostConstruct
    public void initializePlatform() {
        licensePath = applicationProperties.getContextRealPath() + "license/";

        configure();
        initialize();

        Environments.isGCPEnv = Boolean.parseBoolean(System.getProperty("gcpEnv", "false"));
        this.isCloudEnv = Environments.isCloudEnv();

        evaluateLicense();
    }

    @Override
    protected Configuration getConfiguration() {
        return new ConfigurationBuilder().empty();
    }

    @Override
    protected void configureOther(Configuration configuration) {
        ServiceManager sm = this.getServiceManager();

        // license workers
        sm.registerWorkerFactory("LicensePossessionInfoWorker", LicensePossessionInfoWorker::new);
        sm.registerWorkerFactory("LicenseResultInfoWorker", LicenseResultInfoWorker::new);
        sm.registerWorkerFactory("ServerLicenseInfoWorker", ServerLicenseInfoWorker::new);
        sm.registerWorkerFactory("LicenseValidateWorker", LicenseValidateWorker::new);

        // license result provider
        sm.registerServiceResultProviderFactory("LicenseValidationResultProvider", LicenseValidationResultProvider::new);

        // license services
        registerValidateLicenseService(sm);
        registerGetLicensePossessionInfoService(sm);
        registerGetLicenseResultInfoService(sm);
        registerGetServerLicenseInfoService(sm);
    }

    @Override
    protected void initializeOther(Map<String, Object> configParameter, Map<String, Object> workParameter) {
        SingleInformationContainer informationContainer =
                (SingleInformationContainer) configParameter.get(SingleInformationContainer.INFORMATION_CONTAINER);

        informationContainer.addInformation(SERVER_PLATFORM, this);

        LicenseManager licenseManager = new LicenseManager(this, licensePath);
        informationContainer.addInformation(LicenseManager.LICENSE_MANAGER, licenseManager);

        ServerLicenseValue licenseValue = getLicenseValue();
        licenseValue.setServerId(getId());
        informationContainer.addInformation(T3SimpleServer.LICENSE_VALUES, licenseValue);
    }

    public boolean existsRegisteredServer(String serverId) {
        if ("REGISTRY".equals(serverId) || "LicenseServer".equals(serverId)) {
            return true;
        }
        return getRegisteredServer(serverId) != null;
    }

    public Set<String> getRegisteredServerIds() {
        Set<String> serverIds = new HashSet<>();
        for (ApplicationProperties.Server server : applicationProperties.getServer().values()) {
            if (server.getHost() != null) {
                serverIds.add(server.getId());
            }
        }
        return serverIds;
    }

    public String getRegisteredServerUrl(String serverId) {
        ApplicationProperties.Server server = getRegisteredServer(serverId);
        if (server != null) {
            return server.createUrl();
        }
        return null;
    }

    private ApplicationProperties.Server getRegisteredServer(String serverId) {
        for (ApplicationProperties.Server server : applicationProperties.getServer().values()) {
            if (server.getHost() != null && server.getId().equals(serverId)) {
                return server;
            }
        }
        return null;
    }

    public boolean isPlatformService(String serviceId) {
        return Service.containsService(serviceId);
    }

    public boolean isCloudEnv() {
        return isCloudEnv;
    }

    @Override
    public void start() {
        // do nothing
    }

    @Override
    public void stop() {
        // do nothing
    }

    @Override
    protected ServerLicenseValue createLocalLicenseValue() {
        int indexOf = VERSION.indexOf(".");
        String version = VERSION.substring(0, indexOf);

        return new ServerLicenseValue(PRODUCT, version);
    }

    @Override
    public boolean needLicenseCheck(String serviceId) {
        return false;
    }

    public void evaluateLicense() {
        try{
            HashMap<Object, Object> contents = new HashMap<>();
            for (LicenseItem item : getLicenseValue().getExpectedValues()) {
                contents.put(item.getKey(), item.getValue());
            }

            Map<String, Object> message = MessageOperator.makeMessage(MessageType.request.toString(), SERVER_PLATFORM,
                    SERVER_LICENSE, "EvaluateLicense", "request to Evaluate License", contents);
            doService(message);
        } catch (Exception e) {
            logger.warn(ExceptionUtils.getStackTrace(e));
        }
    }

    @Override
    protected void registerHiddenServices(ServiceManager serviceManager) {
        // Register 'LicenseWorker' worker factory
        serviceManager.registerWorkerFactory(LicenseEvaluationWorker.class.getSimpleName(), () -> new LicenseEvaluationWorker(SERVER_LICENSE));

        // Register 'EvaluateLicense' service
        serviceManager.registerService(ServiceInfo.builder()
                .setId(Service.EVALUATE_LICENSE.serviceId)
                .addWorkerEntryInfo(new ServiceWorkerEntry(LicenseEvaluationWorker.class.getSimpleName(), 1))
                .setInitSteps(new int[0])
                .build());

        // Register 'InitializeLicense' service
        serviceManager.registerService(ServiceInfo.builder()
                .setId(Service.INITIALIZE_LICENSE.serviceId)
                .addWorkerEntryInfo(new ServiceWorkerEntry(LicenseInitializerWorker.class.getSimpleName(), 1))
                .addWorkerEntryInfo(new ServiceWorkerEntry(LicenseEvaluationWorker.class.getSimpleName(), 2))
                .build());
    }

    private void registerValidateLicenseService(ServiceManager sm) {
        sm.registerService(ServiceInfo.builder()
                .setId(Service.VALIDATE_LICENSE.serviceId)
                .addWorkerEntryInfo(new ServiceWorkerEntry(LicenseValidateWorker.class.getSimpleName(), 1))
                .addResultProviderInfo(new ServiceWorkerEntry(LicenseValidationResultProvider.class.getSimpleName(), 1))
                .build());
    }

    private void registerGetLicensePossessionInfoService(ServiceManager sm) {
        Map<String, Object> parameter = new HashMap<>();
        parameter.put("step", "1");
        parameter.put("column-data", "COLUMNS_1");
        parameter.put("table-data", "TABLEDATA");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("parameter", parameter);
        Map<String, Object> config = new HashMap<>();
        config.put("parameters", parameters);

        sm.registerService(ServiceInfo.builder()
                .setId(Service.GET_LICENSE_POSSESSION_INFO.serviceId)
                .addWorkerEntryInfo(new ServiceWorkerEntry(LicensePossessionInfoWorker.class.getSimpleName(), 1))
                .addResultProviderInfo(new ServiceWorkerEntry(ResultTypeITC1Provider.class.getSimpleName(), 1), config)
                .build());
    }

    private void registerGetLicenseResultInfoService(ServiceManager sm) {
        Map<String, Object> parameter = new HashMap<>();
        parameter.put("step", "1");
        parameter.put("column-data", "COLUMNS_1");
        parameter.put("table-data", "TABLEDATA");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("parameter", parameter);
        Map<String, Object> config = new HashMap<>();
        config.put("parameters", parameters);

        sm.registerService(ServiceInfo.builder()
                .setId(Service.GET_LICENSE_RESULT_INFO.serviceId)
                .addWorkerEntryInfo(new ServiceWorkerEntry(LicenseResultInfoWorker.class.getSimpleName(), 1))
                .addResultProviderInfo(new ServiceWorkerEntry(ResultTypeITC1Provider.class.getSimpleName(), 1), config)
                .build());
    }

    private void registerGetServerLicenseInfoService(ServiceManager sm) {
        Map<String, Object> parameter = new HashMap<>();
        parameter.put("step", "1");
        parameter.put("data-keys", "SERVER_LICENSE_INFO");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("parameter", parameter);
        Map<String, Object> config = new HashMap<>();
        config.put("parameters", parameters);

        sm.registerService(ServiceInfo.builder()
                .setId(Service.GET_SERVER_LICENSE_INFO.serviceId)
                .addWorkerEntryInfo(new ServiceWorkerEntry(ServerLicenseInfoWorker.class.getSimpleName(), 1))
                .addResultProviderInfo(new ServiceWorkerEntry(ResultTypeIMProvider.class.getSimpleName(), 1), config)
                .build());
    }

    @Override
    public Map<String, Object> doService(final Map<String, Object> message) {
        String serviceId = (String) message.get(MessageOperator.KEY_SERVICE);

        Service service = Service.get(serviceId);
        if (service != null) {
            Map<String, Object> result = service.doService(applicationProperties, message);
            if (result != null) {
                return result;
            }
        }

        return super.doService(message);
    }

    private enum Service {

        GET_SERVER_STATUS("GetServerStatus") {
            @Override
            public Map<String, Object> doService(final ApplicationProperties applicationProperties, final Map<String, Object> message) {
                List<List<Object>> resData = new ArrayList<>();

                for (ApplicationProperties.Server server : applicationProperties.getServer().values()) {
                    String host = server.getHost();
                    if (host == null) {
                        continue;
                    }

                    int port = server.getPort();
                    boolean isAlive = NetworkUtil.checkConnection(host, port);
                    resData.add(Arrays.asList(server.getId(), host, port, isAlive));
                }

                resData.sort(Comparator.comparing(this::getServerSeq));

                List<String> resHeader= new ArrayList<>();
                resHeader.add(ConfigurationConstants.ELEMENT_ID);
                resHeader.add(ConfigurationConstants.ELEMENT_HOST);
                resHeader.add(ConfigurationConstants.ELEMENT_PORT);
                resHeader.add(ConfigurationConstants.ELEMENT_CONNECTION);

                Map<String, Object> resResult = new HashMap<>();
                resResult.put(ServiceConstants.PARAMETER_KEY_RESULT_SUCCESS, true);
                resResult.put(ServiceConstants.PARAMETER_KEY_RESULT_CODE, ServiceConstants.RESULT_CODE_SUCCESS);
                resResult.put(ServiceConstants.PARAMETER_KEY_RESULT_TYPE, ServiceConstants.RESULT_TYPE_ITC_1);
                resResult.put(ServiceConstants.PARAMETER_KEY_RESULT_MESSAGE, "");

                Map<String, Object> returnContents = new HashMap<>();
                returnContents.put(ServiceConstants.PARAMETER_KEY_COLUMNS_1, resHeader);
                returnContents.put(ServiceConstants.PARAMETER_KEY_TABLEDATA, resData);
                returnContents.put(ServiceConstants.PARAMETER_KEY_INFO, resResult);

                Map<String, Object> result = new HashMap<>();
                result.put(MessageOperator.KEY_CONTENTS, returnContents);
                return result;
            }
        },
        INITIALIZE_LICENSE("InitializeLicense"),
        EVALUATE_LICENSE("EvaluateLicense"),
        VALIDATE_LICENSE("ValidateLicense"),
        GET_LICENSE_POSSESSION_INFO("GetLicensePossessionInfo"),
        GET_LICENSE_RESULT_INFO("GetLicenseResultInfo"),
        GET_SERVER_LICENSE_INFO("GetServerLicenseInfo");

        private final String serviceId;

        Service(String name) {
            this.serviceId = name;
        }

        public Map<String, Object> doService(final ApplicationProperties applicationProperties, final Map<String, Object> message) {
            return null;
        }

        public int getServerSeq(List<Object> serverInfo) {
            if (serverInfo == null || serverInfo.isEmpty()) {
                return 999;
            }

            String serverId = serverInfo.get(0).toString();
            switch (serverId) {
                case "T3SeriesBF":
                    return 1;
                case "T3SeriesDP":
                    return 2;
                case "T3SeriesMP":
                    return 3;
                case "T3SeriesFP":
                    return 4;
                default:
                    return 999;
            }
        }

        public static Service get(String serviceId) {
            for (Service service : Service.values()) {
                if (service.serviceId.equals(serviceId)) {
                    return service;
                }
            }
            return null;
        }

        public static boolean containsService(String serviceId) {
            return get(serviceId) != null;
        }

    }

}
