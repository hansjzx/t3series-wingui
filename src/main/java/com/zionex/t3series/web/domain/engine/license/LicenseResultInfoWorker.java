package com.zionex.t3series.web.domain.engine.license;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import com.zionex.t3platform.common.ServiceConstants;
import com.zionex.t3series.framework.ConfigurationException;
import com.zionex.t3simpleserver.worker.AbstractWorker;
import com.zionex.t3simpleserver.worker.ConfigParameterUtil;
import com.zionex.t3simpleserver.worker.SingleInformationContainer;
import com.zionex.t3simpleserver.worker.WorkerFactoryInterface;
import com.zionex.t3simpleserver.worker.WorkerInterface;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LicenseResultInfoWorker extends AbstractWorker implements WorkerFactoryInterface {

    private SingleInformationContainer informationContainer;

    @Override
    public void configure(Map<String, ?> configParams) throws ConfigurationException {
        super.configure(configParams);
        
        informationContainer = ConfigParameterUtil.getInformationContainer(configParams);
    }

    @Override
    public Map<String, Object> work(Map<String, Object> workParams) {
        LicenseManager licenseManager = (LicenseManager) informationContainer.getInformation(LicenseManager.LICENSE_MANAGER);
        
        List<String> targetServers = licenseManager.getTargetServer();
        if (targetServers.isEmpty()) {
            setSuccess(false);
            setResultCode(ServiceConstants.RESULT_CODE_MISSING_TARGET);
            String serviceResultMessage = "cannot find license issued target servers";
            setResultMessage(serviceResultMessage);
            log.warn(serviceResultMessage);
            return workParams;
        }
        
        List<List<Object>> tableData = new ArrayList<>();
        for (String serverId : targetServers) {
            List<Object> resultInfo = licenseManager.getLicenseResultInfo(serverId);
            tableData.add(resultInfo);
        }
        
        List<String> columnNames = Arrays.asList("SERVER_ID", "STATUS", "EXPIRE_DATE", "MESSAGE");
        
        workParams.put(ServiceConstants.PARAMETER_KEY_TABLEDATA, tableData);
        workParams.put(ServiceConstants.PARAMETER_KEY_COLUMNS_1, new ArrayList<Object>(columnNames));
        
        setSuccess(true);
        setResultMessage(ServiceConstants.RESULT_MESSAGE_SUCCESS);
        
        return workParams;
    }

    @Override
    public WorkerInterface createWorker() {
        return new LicenseResultInfoWorker();
    }
    
}
