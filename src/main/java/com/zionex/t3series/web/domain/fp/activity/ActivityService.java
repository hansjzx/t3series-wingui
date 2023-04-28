package com.zionex.t3series.web.domain.fp.activity;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;

    public List<Activity> getActivities() {
        return activityRepository.findAll();
    }

    public List<Activity> getActivitiesByVersionCds(List<String> versionCds) {
        return activityRepository.findByVersionCdInOrderByVersionCd(versionCds);
    }

}
