package com.example.amazonclonebackend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    @org.springframework.core.annotation.Order(1)
    public SecurityFilterChain adminFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/sba/**", "/instances/**", "/actuator/**")
            .csrf(AbstractHttpConfigurer::disable)
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()))
            .authorizeHttpRequests(authz -> authz.anyRequest().hasAuthority("ADMIN"))
            .httpBasic(org.springframework.security.config.Customizer.withDefaults());

        return http.build();
    }

    @Bean
    @org.springframework.core.annotation.Order(2)
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/products", "/api/product/**", "/api/register", "/api/login", "/api/auth/send-otp", "/api/auth/verify-otp", "/api/get-razorpay-key", "/api/seller/*/profile", "/api/seller/*/products").permitAll()
                .requestMatchers("/api/getAuthUser", "/api/logout", "/api/seller/me/profile").authenticated()
                .requestMatchers("/api/admin/**").hasAuthority("ADMIN")
                .requestMatchers("/api/seller/**").hasAnyAuthority("MANAGER","ADMIN")
                .requestMatchers("/api/addtocart/**", "/api/delete/**", "/api/update-qty/**",
                               "/api/create-order", "/api/pay-order").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public org.springframework.security.core.userdetails.UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        org.springframework.security.core.userdetails.UserDetails admin = 
            org.springframework.security.core.userdetails.User.builder()
                .username("mainadmin@@1212")
                .password(passwordEncoder.encode("adminadmin@@"))
                .authorities("ADMIN")
                .build();
        return new org.springframework.security.provisioning.InMemoryUserDetailsManager(admin);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
