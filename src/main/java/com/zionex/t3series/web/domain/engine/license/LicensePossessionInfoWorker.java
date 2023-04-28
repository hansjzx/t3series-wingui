package com.zionex.t3series.web.domain.engine.license;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.exception.ExceptionUtils;

import com.zionex.t3platform.common.ServiceConstants;
import com.zionex.t3series.framework.ConfigurationException;
import com.zionex.t3series.license.LicenseChecker;
import com.zionex.t3simpleserver.worker.AbstractWorker;
import com.zionex.t3simpleserver.worker.ConfigParameterUtil;
import com.zionex.t3simpleserver.worker.SingleInformationContainer;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LicensePossessionInfoWorker extends AbstractWorker {
    
    private SingleInformationContainer informationContainer;

    @Override
    public void configure(Map<String, ?> configParams) throws ConfigurationException {
        super.configure(configParams);
        
        this.informationContainer = ConfigParameterUtil.getInformationContainer(configParams);
    }

    @Override
    public Map<String, Object> work(Map<String, Object> workParams) {
        LicenseManager licenseManager = (LicenseManager) informationContainer.getInformation(LicenseManager.LICENSE_MANAGER);
        
        List<String> targetServers = licenseManager.getTargetServer();
        if (targetServers.isEmpty()) {
            setSuccess(false);
            String serviceResultMessage = "cannot find license issued target servers";
            setResultCode(ServiceConstants.RESULT_CODE_MISSING_TARGET);
            setResultMessage(serviceResultMessage);
            log.warn(serviceResultMessage);
            return workParams;
        }
        
        try {
            List<List<Object>> tableData = new ArrayList<>();
            for (String serverId : targetServers) {
                Map<String, String> licensePossessionInfo = licenseManager.getLicensePossessionInfo(serverId);
                if (licensePossessionInfo.isEmpty()) {
                    List<Object> row = new ArrayList<>();
                    row.add(serverId);
                    row.add(LicenseChecker.VALUE_NONE);
                    row.add(LicenseChecker.VALUE_NONE);
                    row.add(LicenseChecker.VALUE_NONE);
                    row.add(LicenseChecker.VALUE_NONE);
                    row.add(LicenseChecker.VALUE_NONE);
                    row.add(LicenseChecker.VALUE_NONE);
                    
                    tableData.add(row);
                    continue;
                }
                
                List<Object> row = new ArrayList<>();
                row.add(serverId);
                row.add(licensePossessionInfo.get(LicenseChecker.KEY_VERSION));
                row.add(licensePossessionInfo.get(LicenseChecker.KEY_PRODUCT));
                row.add(licensePossessionInfo.get(LicenseChecker.KEY_HARDWAREADDRESS));
                row.add(licensePossessionInfo.get(LicenseChecker.KEY_EXPIREDATE));
                row.add(licensePossessionInfo.get(LicenseChecker.KEY_INSTANCE_COUNT));
                row.add(licensePossessionInfo.get(LicenseChecker.KEY_LIBDIR));
                
                tableData.add(row);
            }
            
            List<String> columnNames = Arrays.asList("SERVER_ID", "VERSION", "PRODUCT", "HWADDR", "EXPIRE_DATE", "INSTANCE_COUNT", "DIR");
            
            workParams.put(ServiceConstants.PARAMETER_KEY_TABLEDATA, tableData);
            workParams.put(ServiceConstants.PARAMETER_KEY_COLUMNS_1, new ArrayList<Object>(columnNames));
            
            setSuccess(true);
            setResultCode(ServiceConstants.RESULT_CODE_SUCCESS);
            
        } catch (Exception e) {
            setSuccess(false);
            setResultCode(ServiceConstants.RESULT_CODE_LICENSE_INVALID);
            log.warn(ExceptionUtils.getStackTrace(e));
        }
        
        return workParams;
    }

}