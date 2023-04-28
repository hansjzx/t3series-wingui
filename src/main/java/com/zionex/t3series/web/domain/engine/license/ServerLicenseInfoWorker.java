package com.zionex.t3series.web.domain.engine.license;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.jdom2.Document;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;

import com.zionex.t3platform.common.ServiceConstants;
import com.zionex.t3series.framework.ConfigurationException;
import com.zionex.t3simpleserver.worker.AbstractWorker;
import com.zionex.t3simpleserver.worker.ConfigParameterUtil;
import com.zionex.t3simpleserver.worker.SingleInformationContainer;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ServerLicenseInfoWorker extends AbstractWorker {

    private static final String SERVER_LICENSE_INFO = "SERVER_LICENSE_INFO";

    private SingleInformationContainer informationContainer;

    @Override
    public void configure(Map<String, ?> configParams) throws ConfigurationException {
        super.configure(configParams);

        informationContainer = ConfigParameterUtil.getInformationContainer(configParams);
    }

    @Override
    public Map<String, Object> work(Map<String, Object> parameter) {
        LicenseManager licenseManager = (LicenseManager) informationContainer.getInformation(LicenseManager.LICENSE_MANAGER);

        List<String> targetServers = licenseManager.getTargetServer();
        if (targetServers.isEmpty()) {
            setSuccess(false);
            setResultCode(ServiceConstants.RESULT_CODE_MISSING_TARGET);
            String serviceResultMessage = "cannot find license issued target servers";
            setResultMessage(serviceResultMessage);
            log.warn(serviceResultMessage);
            return parameter;
        }

        try {
            LicenseGenerator licenseGenerator = licenseManager.getLicenseGenerator();
            Document document = licenseGenerator.getXmlGenerate(targetServers);

            XMLOutputter outputter = new XMLOutputter(Format.getPrettyFormat());
            String serverLicenseInfo = outputter.outputString(document);

            parameter.put(SERVER_LICENSE_INFO, serverLicenseInfo);

            setSuccess(true);
            setResultCode(ServiceConstants.RESULT_CODE_SUCCESS);
        } catch (Exception e) {
            setSuccess(false);
            setResultMessage(e + " : " + e.getMessage());
            log.warn(ExceptionUtils.getStackTrace(e));
        }

        return parameter;
    }

}
