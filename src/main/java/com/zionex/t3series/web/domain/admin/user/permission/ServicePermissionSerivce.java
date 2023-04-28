package com.zionex.t3series.web.domain.admin.user.permission;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServicePermissionSerivce {

    private final ServicePermissionRepository servicePermissionRepository;

    public boolean existsServiceId(String serviceId) {
        return servicePermissionRepository.existsByServiceId(serviceId);
    }

    public ServicePermission getServicePermission(String serviceId, String menuId) {
        return servicePermissionRepository.findByServiceIdAndMenuIdAndUseYnTrue(serviceId, menuId);
    }

}
