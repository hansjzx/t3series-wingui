package com.zionex.t3series.web.domain.engine;

import static com.zionex.t3series.web.constant.ServiceConstants.PARAMETER_KEY_MENU_CD;
import static com.zionex.t3series.web.constant.ServiceConstants.PERMISSION_TYPE_UPDATE;
import static com.zionex.t3series.web.constant.ServiceConstants.RESULT_CODE_PEMISSION_DENIED;

import java.time.Duration;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import com.zionex.t3platform.common.ServiceConstants;
import com.zionex.t3platform.message.MessageOperator;
import com.zionex.t3platform.message.ServiceResultContentException;
import com.zionex.t3platform.message.ServiceResultContentOperator;
import com.zionex.t3series.web.domain.admin.account.AccountManager;
import com.zionex.t3series.web.domain.admin.lang.LangPackService;
import com.zionex.t3series.web.domain.admin.menu.Menu;
import com.zionex.t3series.web.domain.admin.menu.MenuService;
import com.zionex.t3series.web.domain.admin.user.UserService;
import com.zionex.t3series.web.domain.admin.user.permission.PermissionService;
import com.zionex.t3series.web.domain.admin.user.permission.ServicePermission;
import com.zionex.t3series.web.domain.admin.user.permission.ServicePermissionSerivce;
import com.zionex.t3simpleserver.common.ServiceUri;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class EngineAdaptor {

    private static final int DEFAULT_TIMEOUT_MILLISEC = 3600000;

    @Autowired
    private PlatformService platformService;

    private final ServicePermissionSerivce servicePermissionSerivce;
    private final LangPackService langPackService;
    private final PermissionService permissionService;
    private final MenuService menuService;
    private final UserService userService;
    private final AccountManager accountManager;

    @SuppressWarnings("unchecked")
    public Map<String, Object> doSyncService(Map<String, Object> msg) {
        final Map<String, Object> message = MessageOperator.validateMessage(msg);

        String[] to = MessageOperator.getTo(message);

        String serverId = to[0];
        String serviceId = (String) message.get(MessageOperator.KEY_SERVICE);

        if (!platformService.existsRegisteredServer(serverId)) {
            return MessageOperator.makeResponseMessage(MessageOperator.getFrom(message), message,
                    ServiceResultContentOperator.createITypeContent(false, ServiceConstants.RESULT_CODE_MISSING_TARGET, "cannot find destination : " + to[0]));
        }

        if (platformService.isPlatformService(serviceId)) {
            return platformService.doService(message);
        }

        String username = userService.getUserDetails().getUsername();
        if (!accountManager.isSystemAdmin(username)) {
            final Map<String, Object> params = (Map<String, Object>) message.get(MessageOperator.KEY_CONTENTS);
            final String menuCd = (String) params.get(PARAMETER_KEY_MENU_CD);

            String type = (String) params.get("WRK_TYPE");
            if (type != null) {
                if (type.equals("SAVE")) {
                    type = PERMISSION_TYPE_UPDATE;
                }
            }

            boolean isTargetServiceId = servicePermissionSerivce.existsServiceId(serviceId);
            if (isTargetServiceId) {
                Menu menu = menuService.getMenu(menuCd);
                if (menu == null) {
                    return MessageOperator.makeResponseMessage(serviceId, message, ServiceResultContentOperator
                            .createITypeContent(false, RESULT_CODE_PEMISSION_DENIED, "No menu code"));
                } else {
                    ServicePermission servicePermission = servicePermissionSerivce.getServicePermission(serviceId, menu.getId());
                    if (servicePermission != null) {
                        String permissionType = (type == null) ? servicePermission.getPermissionTp() : type;
                        String userId = userService.getUser(username).getId();
    
                        boolean checkPermission = permissionService.checkPermission(userId, menuCd, permissionType);
                        if (!checkPermission) {
                            String deniedMessage = String.format(langPackService.getLanguageValue("MSG_FAIL_PERMISSION_CHECK"),
                                                                 langPackService.getLanguageValue(menuCd), permissionType);
    
                            return MessageOperator.makeResponseMessage(serviceId, message, ServiceResultContentOperator
                                    .createITypeContent(false, RESULT_CODE_PEMISSION_DENIED, deniedMessage));
                        }
                    }
                }
            }
        }

        Map<String, Object> result;
        long timeout = (Integer) message.get(MessageOperator.KEY_TIMEOUT_SEC);
        timeout = (timeout < 1) ? DEFAULT_TIMEOUT_MILLISEC : timeout;

        try {
            String baseUrl = platformService.getRegisteredServerUrl(serverId);

            ExchangeStrategies exchangeStrategies = ExchangeStrategies.builder()
                    .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(-1)).build();

            WebClient webClient = WebClient.builder()
                    .baseUrl(baseUrl)
                    .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .exchangeStrategies(exchangeStrategies)
                    .build();

            result = webClient.post()
                    .uri(ServiceUri.T3SERIES_SERVICE)
                    .bodyValue(message)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofMillis(timeout))
                    .block();

            Object contents = MessageOperator.getContents(result);

            if (isServiceFailed(contents)) {
                int repeatCount = MessageOperator.getRepeatCount(message);
                if (repeatCount > 0) {
                    int count = 0;
                    while (true) {
                        result = webClient.post()
                                .uri(ServiceUri.T3SERIES_SERVICE)
                                .bodyValue(message)
                                .retrieve()
                                .bodyToMono(Map.class)
                                .timeout(Duration.ofMillis(timeout))
                                .block();

                        contents = MessageOperator.getContents(result);
                        if (isServiceSucceed(contents)) {
                            break;
                        }

                        count++;
                        if (count > repeatCount) {
                            break;
                        }
                    }
                }
            }

        } catch (Exception e) {
            log.error("An error occurred while requesting the service again. {}", e.getMessage());
            return MessageOperator.makeResponseMessage(MessageOperator.getFrom(message), message,
                    ServiceResultContentOperator.createITypeContent(false, ServiceConstants.RESULT_CODE_FAIL, "response is not received."));
        }

        return result;
    }

    private boolean isServiceFailed(Object contents) throws ServiceResultContentException {
        return ServiceResultContentOperator.isStandardServiceResult(contents)
                && !ServiceResultContentOperator.isStandardServiceSuccess(contents)
                && ServiceConstants.RESULT_CODE_CONNECTION_FAIL.equals(ServiceResultContentOperator.getResultCode(contents));
    }

    private boolean isServiceSucceed(Object contents) {
        return ServiceResultContentOperator.isStandardServiceResult(contents)
                && ServiceResultContentOperator.isStandardServiceSuccess(contents);
    }

}
