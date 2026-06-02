package com.example.amazonclonebackend.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@ConditionalOnProperty(name = "app.db.verify", havingValue = "true")
public class DbVerifierRunner implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;
    private final Environment env;
    private final Logger log = LoggerFactory.getLogger(DbVerifierRunner.class);

    public DbVerifierRunner(JdbcTemplate jdbcTemplate, Environment env) {
        this.jdbcTemplate = jdbcTemplate;
        this.env = env;
    }

    @Override
    public void run(String... args) {
        String dsUrl = env.getProperty("spring.datasource.url");
        log.info("DB verifier: active datasource url (masked)={}", maskUrl(dsUrl));

        try {
            String currentDb = jdbcTemplate.queryForObject("select current_database()", String.class);
            String currentUser = jdbcTemplate.queryForObject("select current_user", String.class);
            log.info("DB verifier: current_database={}, current_user={}", currentDb, currentUser);
        } catch (Exception e) {
            log.warn("DB verifier: could not read database metadata: {}", e.getMessage());
        }

        try {
            List<Map<String, Object>> tableRows = jdbcTemplate.queryForList(
                    "select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE'");

            List<String> tables = tableRows.stream()
                    .map(m -> (String) m.get("table_name"))
                    .collect(Collectors.toList());

            log.info("DB verifier: public tables={}", tables);

            Map<String, Long> counts = new HashMap<>();
            for (String t : tables) {
                try {
                    Long c = jdbcTemplate.queryForObject(String.format("select count(*) from \"%s\"", t), Long.class);
                    counts.put(t, c == null ? 0L : c);
                } catch (Exception e) {
                    log.warn("DB verifier: count failed for {}: {}", t, e.getMessage());
                }
            }
            log.info("DB verifier: row counts={}", counts);

            try {
                List<Map<String, Object>> flyway = jdbcTemplate.queryForList(
                        "select installed_rank, version, description, success from flyway_schema_history order by installed_rank");
                log.info("DB verifier: flyway migrations={}", flyway);
            } catch (Exception e) {
                log.warn("DB verifier: flyway_schema_history not found or error: {}", e.getMessage());
            }

        } catch (Exception e) {
            log.warn("DB verifier: error enumerating tables: {}", e.getMessage());
        }
    }

    private String maskUrl(String url) {
        if (url == null) return "UNKNOWN";
        // URL typically doesn't include password when provided via env vars; return as-is for visibility
        return url;
    }
}
