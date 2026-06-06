package com.example.amazonclonebackend.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.ShallowEtagHeaderFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Configuration
public class ResponseCachingConfig {

    // Register ETag filter for API responses so clients can use conditional GETs (If-None-Match)
    @Bean
    public FilterRegistrationBean<ShallowEtagHeaderFilter> shallowEtagFilter() {
        FilterRegistrationBean<ShallowEtagHeaderFilter> filter = new FilterRegistrationBean<>(new ShallowEtagHeaderFilter());
        filter.addUrlPatterns("/api/*");
        filter.setName("shallowEtagFilter");
        filter.setOrder(1);
        return filter;
    }

    // Add cache-control headers for GET API endpoints used by the frontend sections.
    // We set private caching for authenticated endpoints and public caching for public endpoints.
    @Bean
    public FilterRegistrationBean<OncePerRequestFilter> apiCacheControlFilter() {
        FilterRegistrationBean<OncePerRequestFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
                try {
                    filterChain.doFilter(request, response);
                } finally {
                    // Only tweak caching for successful GET responses
                    if ("GET".equalsIgnoreCase(request.getMethod()) && response.getStatus() >= 200 && response.getStatus() < 300) {
                        String path = request.getRequestURI();
                        // Public content: products, product detail, public seller profile
                        if (path.startsWith(request.getContextPath() + "/api/products") || path.startsWith(request.getContextPath() + "/api/product") || path.matches(request.getContextPath() + "/api/product/.*") || path.startsWith(request.getContextPath() + "/api/seller/") && request.getQueryString()==null) {
                            // allow browser to cache publicly for short time, but still validate with ETag
                            response.setHeader("Cache-Control", "public, max-age=30, must-revalidate");
                        }

                        // Seller and admin section GETs (authenticated) - keep private cache and rely on ETag for validation
                        if (path.startsWith(request.getContextPath() + "/api/seller") || path.startsWith(request.getContextPath() + "/api/admin")) {
                            response.setHeader("Cache-Control", "private, max-age=30, must-revalidate");
                        }
                    }
                }
            }
        });
        registration.addUrlPatterns("/api/*");
        registration.setName("apiCacheControlFilter");
        registration.setOrder(2);
        return registration;
    }

}
