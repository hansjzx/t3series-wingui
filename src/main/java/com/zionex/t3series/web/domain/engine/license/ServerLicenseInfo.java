package com.zionex.t3series.web.domain.engine.license;

import java.util.List;
import java.util.Map;
import java.util.Vector;

import com.zionex.t3series.license.DefaultLicenseItem;
import com.zionex.t3series.license.ExpectedValueAbstract;
import com.zionex.t3series.license.IgnorableLicenseItem;
import com.zionex.t3series.license.IntersectionLicenseItem;
import com.zionex.t3series.license.LicenseChecker;
import com.zionex.t3series.license.LicenseItem;

public class ServerLicenseInfo extends ExpectedValueAbstract {

    private final Map<String, String> licenseValue;

    public ServerLicenseInfo(Map<String, String> licenseValue) {
        this.licenseValue = licenseValue;
    }

    @Override
    protected List<LicenseItem> getFixedLicenseItemValues() {
        Vector<LicenseItem> licenseValues = new Vector<>();
        licenseValues.add(new IntersectionLicenseItem(LicenseChecker.KEY_SERVER_ID, licenseValue.get(LicenseChecker.KEY_SERVER_ID)));
        licenseValues.add(new IntersectionLicenseItem(LicenseChecker.KEY_PRODUCT, licenseValue.get(LicenseChecker.KEY_PRODUCT)));
        licenseValues.add(new DefaultLicenseItem(LicenseChecker.KEY_VERSION, licenseValue.get(LicenseChecker.KEY_VERSION)));
        licenseValues.add(new IntersectionLicenseItem(LicenseChecker.KEY_IPADDRESS, licenseValue.get(LicenseChecker.KEY_IPADDRESS)));
        licenseValues.add(new IntersectionLicenseItem(LicenseChecker.KEY_HARDWAREADDRESS, licenseValue.get(LicenseChecker.KEY_HARDWAREADDRESS)));
        licenseValues.add(new IntersectionLicenseItem(LicenseChecker.KEY_LIBDIR, licenseValue.get(LicenseChecker.KEY_LIBDIR)));
        licenseValues.add(new IgnorableLicenseItem(LicenseChecker.KEY_INSTANCE_COUNT, "1"));

        return licenseValues;
    }

}
