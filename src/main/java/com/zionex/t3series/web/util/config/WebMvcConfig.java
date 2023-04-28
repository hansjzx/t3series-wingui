package com.zionex.t3series.web.util.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.filter.ShallowEtagHeaderFilter;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.zionex.t3series.web.ApplicationProperties;
import com.zionex.t3series.web.util.interceptor.ExecPermissionInterceptor;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final ApplicationProperties applicationProperties;
    private final ExecPermissionInterceptor execPermissionInterceptor;

    private final String[] cachePathPattern = {
        "**/js/**",
        "**/css/**",
        "**/fonts/**",
        "**/images/**"
    };

    private final String[] cacheUrlPattern = {
        "/js/*",
        "/css/*",
        "/fonts/*",
        "/images/*"
    };

    private final String[] excludeUrl = {
        "/",
        "/logout",
        "/authentication",
        "/auth-info",
        "/system/settings",
        "/template/*",
        "/view-config/*",
        "/menus",
        "/system/lang-packs/*/cached",
        "/system/users/grid-layouts/**",
        "/noticeboard-home",
        "/calendar/**",
        "/engine/**",
        "/js/*",
        "/css/*",
        "/fonts/*",
        "/images/*",
        "/license/*"
    };

    @Bean
    public FilterRegistrationBean<ShallowEtagHeaderFilter> shallowEtagHeaderFilter() {
        FilterRegistrationBean<ShallowEtagHeaderFilter> filterRegistrationBean = new FilterRegistrationBean<>(new ShallowEtagHeaderFilter());
        filterRegistrationBean.addUrlPatterns(cacheUrlPattern);

        return filterRegistrationBean;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        boolean cacheEnable = applicationProperties.getCache().isEnable();
        if (cacheEnable) {
            CacheControl cacheControl = CacheControl.noCache().cachePrivate();
            registry.addResourceHandler(cachePathPattern).addResourceLocations("/").setCacheControl(cacheControl); 
        }
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(execPermissionInterceptor)
                .excludePathPatterns(excludeUrl);
    }

}
