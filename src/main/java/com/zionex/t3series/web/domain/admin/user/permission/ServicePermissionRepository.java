package com.zionex.t3series.web.domain.admin.user.permission;

import org.springframework.data.repository.CrudRepository;

public interface ServicePermissionRepository extends CrudRepository<ServicePermission, String> {

    public boolean existsByServiceId(String serviceId);

    public ServicePermission findByServiceIdAndMenuIdAndUseYnTrue(String serviceId, String menuId);

}
