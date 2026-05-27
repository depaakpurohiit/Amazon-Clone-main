package com.example.amazonclonebackend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.net.URI;

@Component
public class DatasourceDiagnostics implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatasourceDiagnostics.class);

    private final Environment environment;

    @Value("${spring.datasource.url:}")
    private String datasourceUrl;

    @Value("${spring.datasource.driver-class-name:}")
    private String datasourceDriver;

    @Value("${spring.jpa.database-platform:}")
    private String databaseDialect;

    public DatasourceDiagnostics(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void run(String... args) {
        String[] activeProfiles = environment.getActiveProfiles();
        String profileSummary = activeProfiles.length == 0 ? "default" : String.join(",", activeProfiles);
        logger.info("Active Spring profile(s): {}", profileSummary);
        logger.info("Datasource driver: {}", datasourceDriver);
        logger.info("Datasource dialect: {}", databaseDialect);
        logger.info("Datasource target: {}", sanitizeDatasourceTarget(datasourceUrl));
        if (datasourceUrl != null && datasourceUrl.startsWith("jdbc:h2")) {
            logger.warn("Backend is using H2 datasource. Registrations will not appear in Neon/Postgres.");
        }
    }

    private String sanitizeDatasourceTarget(String jdbcUrl) {
        if (jdbcUrl == null || jdbcUrl.isBlank()) {
            return "not-configured";
        }
        if (jdbcUrl.startsWith("jdbc:postgresql://")) {
            String withoutPrefix = jdbcUrl.substring("jdbc:".length());
            URI uri = URI.create(withoutPrefix);
            String host = uri.getHost() == null ? "unknown-host" : uri.getHost();
            int port = uri.getPort();
            String path = uri.getPath() == null ? "" : uri.getPath();
            return port > 0 ? "postgresql://" + host + ":" + port + path : "postgresql://" + host + path;
        }
        if (jdbcUrl.startsWith("jdbc:h2:file:")) {
            return jdbcUrl.split(";", 2)[0];
        }
        return jdbcUrl.split(";", 2)[0];
    }
}
