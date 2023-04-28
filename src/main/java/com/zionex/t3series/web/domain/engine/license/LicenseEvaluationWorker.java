package com.zionex.t3series.web.domain.engine.license;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.exception.ExceptionUtils;

import com.zionex.t3platform.common.ServiceConstants;
import com.zionex.t3platform.message.MessageOperator;
import com.zionex.t3platform.message.MessageOperator.MessageType;
import com.zionex.t3series.framework.ConfigurationException;
import com.zionex.t3series.license.LicenseChecker;
import com.zionex.t3series.license.LicenseItem;
import com.zionex.t3series.web.domain.engine.PlatformService;
import com.zionex.t3simpleserver.T3SimpleServer;
import com.zionex.t3simpleserver.license.ServerLicenseStatus;
import com.zionex.t3simpleserver.license.ServerLicenseStatus.ValidateState;
import com.zionex.t3simpleserver.license.ServerLicenseValue;
import com.zionex.t3simpleserver.worker.AbstractWorker;
import com.zionex.t3simpleserver.worker.ConfigParameterUtil;
import com.zionex.t3simpleserver.worker.SingleInformationContainer;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LicenseEvaluationWorker extends AbstractWorker {

    private static final String UNKNOWN = "UNKNOWN";

    private SingleInformationContainer informationContainer;

    private final String licenseServer;

    public LicenseEvaluationWorker(final String licenseServer) {
        this.licenseServer = licenseServer;
    }

    @Override
    public void configure(Map<String, ?> configParams) throws ConfigurationException {
        this.informationContainer = ConfigParameterUtil.getInformationContainer(configParams);
    }

    @Override
    public Map<String, Object> work(Map<String, Object> parameter) {
        try {
            ServerLicenseStatus serverLicenseStatus = (ServerLicenseStatus) informationContainer.getInformation(ServerLicenseStatus.SERVER_LICENSE_STATUS);
            if (serverLicenseStatus != null && this.licenseServer != null) {
                PlatformService adapter = (PlatformService) informationContainer.getInformation(PlatformService.SERVER_PLATFORM);
                if (!serverLicenseStatus.isLicenseChecked()) {
                    if (adapter == null) {
                        setSuccess(false);
                        setServiceComplete(true);
                        setResultCode(ServiceConstants.RESULT_CODE_ADAPTOR_NONE);
                        return parameter;
                    }

                    String serverId = adapter.getId();
                    ServerLicenseValue licenseValue = (ServerLicenseValue) informationContainer.getInformation(T3SimpleServer.LICENSE_VALUES);
                    if (licenseValue == null) {
                        setSuccess(false);
                        setServiceComplete(true);
                        setResultCode(ServiceConstants.RESULT_CODE_LICENSE_INVALID);
                        String serviceResultMessage = "cannot find license values of " + serverId;
                        setResultMessage(serviceResultMessage);
                        log.warn(serviceResultMessage);
                        return parameter;
                    }

                    HashMap<Object, Object> contents = new HashMap<>();
                    for (LicenseItem item : licenseValue.getExpectedValues()) {
                        if (item.getErrorMessage() != null) {
                            serverLicenseStatus.setErrorMessage(item.getErrorMessage());
                            serverLicenseStatus.setValidateState(ValidateState.INVALID);
                            return parameter;
                        }

                        contents.put(item.getKey(), item.getValue());
                    }

                    Map<String, Object> message = MessageOperator.makeMessage(MessageType.request.toString(), serverId,
                            licenseServer, ServiceConstants.LicenseServerReservedService.ValidateLicense.toString(), "request to validate license", contents);
                    Map<String, Object> result = adapter.doService(message); // result is made by LicenseValidationResultProvider

                    String service = (String) result.get(MessageOperator.KEY_SERVICE);
                    if (UNKNOWN.equals(service)) {
                        setSuccess(false);
                        setServiceComplete(true);
                        setResultCode(ServiceConstants.RESULT_CODE_MISSING_TARGET);
                        String resultMessage = "cannot find license server.";
                        log.warn(resultMessage);
                        setResultMessage(resultMessage);
                        return parameter;
                    }

                    result.put(LicenseChecker.KEY_SERVER_ID, serverId);
                    serverLicenseStatus.setStatus(result);
                }

                if (serverLicenseStatus.isInvalid()) {
                    setSuccess(false);
                    setServiceComplete(true);
                    String errorMessage = serverLicenseStatus.getErrorMessage();
                    setResultMessage(errorMessage);
                    setResultCode(ServiceConstants.RESULT_CODE_LICENSE_INVALID);
                    log.warn(errorMessage);
                }

            } else {
                setSuccess(false);
                setServiceComplete(true);
                setResultCode(ServiceConstants.RESULT_CODE_LICENSE_INVALID);
                String serviceResultMessage = "cannot find license status or license server info";
                setResultMessage(serviceResultMessage);
                log.warn(serviceResultMessage);
            }

        } catch (IOException e) {
            setSuccess(false);
            setServiceComplete(true);
            setResultMessage(e + " : " + e.getMessage());

            log.warn(ExceptionUtils.getStackTrace(e));
        }

        return parameter;
    }

}
