package com.zionex.t3series.web.domain.engine.license;

import java.util.List;
import java.util.Map;

import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.zionex.t3series.license.LicenseChecker;
import com.zionex.t3series.license.LicenseItem;

public class DynamicItemValidatorJob implements Job {
    
    public static final String DYNAMIC_ITEM_VALIDATOR = "DYNAMIC_ITEM_VALIDATOR";
    public static final String LICENSE_CHECKER = "LICENSE_CHECKER";

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        JobDataMap data = context.getJobDetail().getJobDataMap();
        
        LicenseChecker checker = (LicenseChecker) data.get(DynamicItemValidatorJob.LICENSE_CHECKER);
        LicenseManager licenseManager = (LicenseManager) data.get(LicenseManager.LICENSE_MANAGER);
        List<LicenseItem> licenseItems = licenseManager.getDynamicItems();
        Map<String, String> licenseValues = licenseManager.getDynamicValues();
        
        boolean isSuccess = checker.checkExpectedValues(licenseValues, licenseItems);
        if (!isSuccess) {
            licenseManager.licenseFileChanged();
        }
    }

}
