package com.zionex.t3series.web.domain.admin.user.preference;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PreferenceMasterRepository extends JpaRepository<PreferenceMaster, String> {

    List<PreferenceMaster> findByViewCd(String viewCd);

    List<PreferenceMaster> findByViewCdAndCrosstabTpNotNull(String viewCd);

    List<PreferenceMaster> findByViewCdContainingIgnoreCaseOrderByViewCdAscGridCdAsc(String viewCd);

}
