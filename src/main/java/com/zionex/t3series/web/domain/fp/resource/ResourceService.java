package com.zionex.t3series.web.domain.fp.resource;

import com.zionex.t3series.web.domain.fp.organization.Stage;
import com.zionex.t3series.web.domain.fp.organization.StageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    private final StageRepository stageRepository;

    public Resource getResource(String resourceCd) {
        return resourceRepository.findTop1ByResourceCd(resourceCd);
    }

    public List<Resource> getResources() {
        return resourceRepository.findAll();
    }

    public List<Resource> getResources(String search) {
        search = search == null ? "" : search;

        return resourceRepository.findResources(search, search);
    }

    public List<Resource> getToolResources(String search) {
        search = search == null ? "" : search;

        return resourceRepository.findToolResources(search, search, true);
    }

    public List<Resource> getNotToolResources(String search) {
        search = search == null ? "" : search;

        return resourceRepository.findToolResources(search, search, false);
    }

    public void saveResource(Resource resource) {
        resourceRepository.save(resource);
    }

    public boolean saveResources(List<Resource> resources) {
        Map<String, Stage> stageMap = stageRepository.findAll()
                .stream()
                .collect(Collectors.toMap(Stage::getStageCd, Function.identity()));

        Map<String, String> resourceMap = getResources()
                .stream()
                .collect(Collectors.toMap(Resource::getResourceCd, Resource::getId));

        for (Resource resource : resources) {
            // Not Null Default Value;
            if (resource.getToolResourceYn() == null) {
                resource.setToolResourceYn(false);
            }
            if (resource.getToolCnt() == null) {
                resource.setToolCnt(1L);
            }
            if (resource.getJcTm() == null) {
                resource.setJcTm(0L);
            }
            if (resource.getRouteJcTm() == null) {
                resource.setRouteJcTm(0L);
            }
            if (resource.getRouteGrpJcTm() == null) {
                resource.setRouteGrpJcTm(0L);
            }
            if (resource.getJcDivideTpCd() == null) {
                resource.setJcDivideTpCd("Y");
            }
            if (resource.getBatchResourceYn() == null) {
                resource.setBatchResourceYn(false);
            }

            Stage stage = stageMap.get(resource.getStageCode());
            resource.setStage(stage);

            if (resource.getId() == null || resource.getId().trim().isEmpty()) {
                resource.setId(resourceMap.get(resource.getResourceCd()));
            }
        }

        try {
            resourceRepository.saveAll(resources);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

    public boolean deleteResources(List<Resource> resources) {
        try {
            resourceRepository.deleteAll(resources);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

    public boolean updateJobChange(List<Resource> resources) {
        try {
            Map<String, Resource> resourceMap = getResources().stream()
                    .collect(Collectors.toMap(Resource::getResourceCd, Function.identity()));

            List<Resource> updateResources = new ArrayList<>();

            for (Resource resource : resources) {
                Resource updateResource = resourceMap.get(resource.getResourceCd());

                if (updateResource != null) {
                    updateResource.setJcTm(resource.getJcTm());
                    updateResource.setRouteJcTm(resource.getRouteJcTm());
                    updateResource.setRouteGrpJcTm(resource.getRouteGrpJcTm());
                    updateResource.setJcDivideTpCd(resource.getJcDivideTpCd());
                    updateResource.setTimeUom(resource.getTimeUom());

                    updateResources.add(updateResource);
                }
            }
            resourceRepository.saveAll(updateResources);
            return true;
        } catch (Exception ignored) {
        }

        return false;
    }

}
