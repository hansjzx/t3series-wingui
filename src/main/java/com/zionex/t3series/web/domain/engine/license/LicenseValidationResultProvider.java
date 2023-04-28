package com.zionex.t3series.web.domain.engine.license;

import java.util.Map;

import com.zionex.t3platform.common.ServiceConstants;
import com.zionex.t3platform.message.ServiceResultContentOperator;
import com.zionex.t3series.framework.ConfigurationException;
import com.zionex.t3simpleserver.resultprovider.ServiceResultProviderInterface;

public class LicenseValidationResultProvider implements ServiceResultProviderInterface {

    @Override
    public void configure(Map<String, ?> parameter) throws ConfigurationException {
    }

    @Override
    public boolean appliable(Map<String, Object> result, boolean success) {
        return success
                && result != null
                && !result.isEmpty()
                && result.containsKey(ServiceConstants.PARAMETER_KEY_MAPDATA);
    }

    @Override
    public Map<String, Object> getServiceResult(Map<String, Object> result, boolean success, String resultCode, String resultMessage) {
        return ServiceResultContentOperator.updateServiceResult(success, resultCode, resultMessage, result);
    }

}
