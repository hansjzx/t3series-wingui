package com.zionex.t3series.web.domain.engine.license;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.jdom2.Document;
import org.jdom2.Element;

import com.zionex.t3platform.message.MessageOperator;
import com.zionex.t3platform.message.MessageOperator.MessageType;
import com.zionex.t3platform.message.ServiceResultContentException;
import com.zionex.t3platform.message.ServiceResultContentOperator;
import com.zionex.t3series.license.LicenseChecker;
import com.zionex.t3series.web.domain.engine.PlatformService;

public class LicenseGenerator {

    private static final String ELEMENT_T3SERIES = "t3series";
    private static final String ELEMENT_LICENSE_INFOS = "license-infos";
    private static final String ELEMENT_LICENSE_INFO = "license-info";

    private final LicenseManager licenseManager;
    private final PlatformService adapter;

    public LicenseGenerator(LicenseManager licenseManager, PlatformService adapter) {
        this.licenseManager = licenseManager;
        this.adapter = adapter;
    }

    @SuppressWarnings("unchecked")
    public Map<String, String> getLicenseValues(String serverId) {
        Map<String, Object> contents = new HashMap<>();

        Map<String, Object> message = MessageOperator.makeMessage(MessageType.request.toString(), adapter.getId(),
                serverId, "GetLicenseValues", "request to license values", contents);
        Map<String, Object> result = adapter.getEngineAdaptor().doSyncService(message);

        Map<String, Object> resultContents = (Map<String, Object>) MessageOperator.getContents(result);

        if (ServiceResultContentOperator.isStandardServiceResult(resultContents)
                && ServiceResultContentOperator.isStandardServiceSuccess(resultContents)
                && ServiceResultContentOperator.hasMap(resultContents)) {
            try {
                return ServiceResultContentOperator.getMapData(resultContents);
            } catch (ServiceResultContentException e) {
                throw new RuntimeException("Cannot find license value of " + serverId + " : " + e.getMessage());
            }
        }

        String resultMessage;
        try {
            resultMessage = ServiceResultContentOperator.hasResultMessage(resultContents) ? ServiceResultContentOperator.getResultMessage(resultContents) : "";
        } catch (ServiceResultContentException e) {
            resultMessage = e.getMessage();
        }
        throw new RuntimeException("Cannot find license value of " + serverId + " : " + resultMessage);
    }

    public Document getXmlGenerate(Collection<String> targetServers) {
        Document document = new Document();
        Element rootElement = new Element(ELEMENT_T3SERIES);
        document.setRootElement(rootElement);
        Element serversElement = new Element(ELEMENT_LICENSE_INFOS);
        rootElement.addContent(serversElement);

        for (String serverId : targetServers) {
            Map<String, String> licenseValues;
            try {
                if (licenseManager.hasServerLicenseInfo(serverId)) {
                    licenseValues = licenseManager.getServerLicenseInfo(serverId);
                } else {
                    licenseValues = getLicenseValues(serverId);
                }

            } catch (Exception e) {
                continue;
            }

            String product = licenseValues.get(LicenseChecker.KEY_PRODUCT);
            if (LicenseChecker.VALUE_UNDEFINED.equals(product)) {
                continue;
            }

            if (!licenseValues.isEmpty()) {
                Element serverElement = new Element(ELEMENT_LICENSE_INFO);
                serversElement.addContent(serverElement);

                for (Entry<String, String> entry : licenseValues.entrySet()) {
                    Element element = new Element(entry.getKey());
                    element.setText(entry.getValue());
                    serverElement.addContent(element);
                }
            }
        }

        return document;
    }

}
