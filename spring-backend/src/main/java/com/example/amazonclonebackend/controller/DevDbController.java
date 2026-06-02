package com.example.amazonclonebackend.controller;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/debug/db")
@ConditionalOnProperty(name = "app.db.verify", havingValue = "true")
public class DevDbController {

    private final JdbcTemplate jdbc;
    private final Environment env;

    public DevDbController(JdbcTemplate jdbc, Environment env) {
        this.jdbc = jdbc;
        this.env = env;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        Map<String, Object> result = new HashMap<>();

        String dsUrl = env.getProperty("spring.datasource.url");
        result.put("datasourceUrl", maskUrl(dsUrl));

        try {
            result.put("current_database", jdbc.queryForObject("select current_database()", String.class));
            result.put("current_user", jdbc.queryForObject("select current_user", String.class));
        } catch (Exception e) {
            result.put("db_meta_error", e.getMessage());
        }

        try {
            List<Map<String, Object>> tableRows = jdbc.queryForList(
                    "select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE'");

            List<String> tables = tableRows.stream()
                    .map(m -> (String) m.get("table_name"))
                    .collect(Collectors.toList());

            result.put("tables", tables);

            Map<String, Long> counts = new HashMap<>();
            for (String t : tables) {
                try {
                    Long c = jdbc.queryForObject(String.format("select count(*) from \"%s\"", t), Long.class);
                    counts.put(t, c == null ? 0L : c);
                } catch (Exception e) {
                    counts.put(t, -1L);
                }
            }
            result.put("rowCounts", counts);
        } catch (Exception e) {
            result.put("table_enumeration_error", e.getMessage());
        }

        try {
            List<Map<String, Object>> flyway = jdbc.queryForList(
                    "select installed_rank, version, description, success from flyway_schema_history order by installed_rank");
            result.put("flyway", flyway);
        } catch (Exception e) {
            result.put("flyway_error", e.getMessage());
        }

        return result;
    }

    private String maskUrl(String url) {
        if (url == null) return "UNKNOWN";
        return url;
    }
}
