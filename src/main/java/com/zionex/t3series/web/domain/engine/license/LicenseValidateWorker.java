package com.zionex.t3series.web.domain.engine.license;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.exception.ExceptionUtils;

import com.zionex.t3platform.common.ServiceConstants;
import com.zionex.t3series.framework.ConfigurationException;
import com.zionex.t3series.license.LicenseChecker;
import com.zionex.t3series.web.domain.engine.PlatformService;
import com.zionex.t3simpleserver.license.ServerLicenseStatus;
import com.zionex.t3simpleserver.worker.AbstractWorker;
import com.zionex.t3simpleserver.worker.ConfigParameterUtil;
import com.zionex.t3simpleserver.worker.SingleInformationContainer;
import com.zionex.t3simpleserver.worker.WorkerParameterUtil;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LicenseValidateWorker extends AbstractWorker {

    private LicenseManager licenseManager;
    private PlatformService adaptor;

    @Override
    public void configure(Map<String, ?> configParams) throws ConfigurationException {
        super.configure(configParams);

        SingleInformationContainer informationContainer = ConfigParameterUtil.getInformationContainer(configParams);
        licenseManager = (LicenseManager) informationContainer.getInformation(LicenseManager.LICENSE_MANAGER);
        adaptor = (PlatformService) informationContainer.getInformation(PlatformService.SERVER_PLATFORM);
    }

    @Override
    public Map<String, Object> work(Map<String, Object> workParams) {
        try {
            String serverId = (String) WorkerParameterUtil.getMessageContentValue(workParams, LicenseChecker.KEY_SERVER_ID, "");
            String product = (String) WorkerParameterUtil.getMessageContentValue(workParams, LicenseChecker.KEY_PRODUCT, "");

            boolean isValidLicense;
            boolean isCloudEnv = adaptor.isCloudEnv();
            boolean needLicenseCheck = !isCloudEnv;

            if (needLicenseCheck) {
                Map<String, String> licenseValues = new HashMap<>();
                licenseValues.put(LicenseChecker.KEY_SERVER_ID, serverId);
                licenseValues.put(LicenseChecker.KEY_PRODUCT, product);
                licenseValues.put(LicenseChecker.KEY_VERSION, (String) WorkerParameterUtil.getMessageContentValue(workParams, LicenseChecker.KEY_VERSION, ""));
                licenseValues.put(LicenseChecker.KEY_IPADDRESS, (String) WorkerParameterUtil.getMessageContentValue(workParams, LicenseChecker.KEY_IPADDRESS, ""));
                licenseValues.put(LicenseChecker.KEY_HARDWAREADDRESS, (String) WorkerParameterUtil.getMessageContentValue(workParams, LicenseChecker.KEY_HARDWAREADDRESS, ""));
                licenseValues.put(LicenseChecker.KEY_LIBDIR, (String) WorkerParameterUtil.getMessageContentValue(workParams, LicenseChecker.KEY_LIBDIR, ""));
                licenseManager.setExpectedValueInfo(serverId, licenseValues);
                isValidLicense = licenseManager.checkLicense(serverId);

            } else {
                isValidLicense = true;
            }

            licenseManager.setLicenseConfirmResult(serverId, isValidLicense);

            if (isValidLicense) {
                setSuccess(true);
                setResultCode(ServiceConstants.RESULT_CODE_SUCCESS);
                Map<String, Object> licenseResult = new HashMap<>();
                Map<String, String> licensePossessionInfo = licenseManager.getLicensePossessionInfo(serverId);

                if (!needLicenseCheck && (licensePossessionInfo.isEmpty() || !licensePossessionInfo.containsKey(LicenseChecker.KEY_INSTANCE_COUNT))) {
                    licensePossessionInfo = new HashMap<>();
                    licensePossessionInfo.put(LicenseChecker.KEY_INSTANCE_COUNT, "1");
                }

                licenseResult.put(ServerLicenseStatus.LICENSE_POSSESSION_INFO, licensePossessionInfo);
                workParams.put(ServiceConstants.PARAMETER_KEY_MAPDATA, licenseResult);

                return workParams;

            } else {
                setSuccess(false);
                setResultCode(ServiceConstants.RESULT_CODE_LICENSE_INVALID);
                setResultMessage(licenseManager.getLicenseErrorMessage(serverId));

                return workParams;
            }
        } catch (Exception e) {
            setSuccess(false);
            setResultCode(ServiceConstants.RESULT_CODE_LICENSE_INVALID);
            setResultMessage(e + " : " + e.getMessage());
            log.warn(ExceptionUtils.getStackTrace(e));

            return workParams;
        }
    }

}
