package com.example.amazonclonebackend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Lightweight, idempotent schema patching to keep local H2 + Neon/Postgres working
 * when new columns are introduced.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
public class SchemaMigrator implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        // Products: category + simple tags for UI filters
        // Use quoted identifiers because hibernate.globally_quoted_identifiers=true creates quoted lowercase names.
        safeExec("ALTER TABLE \"products\" ADD COLUMN IF NOT EXISTS \"category\" VARCHAR(50)");
        safeExec("ALTER TABLE \"products\" ADD COLUMN IF NOT EXISTS \"best_seller\" BOOLEAN NOT NULL DEFAULT FALSE");
        safeExec("ALTER TABLE \"products\" ADD COLUMN IF NOT EXISTS \"today_deal\" BOOLEAN NOT NULL DEFAULT FALSE");
        safeExec("ALTER TABLE \"products\" ADD COLUMN IF NOT EXISTS \"new_release\" BOOLEAN NOT NULL DEFAULT FALSE");
        safeExec("UPDATE \"products\" SET \"category\" = 'ELECTRONICS' WHERE \"category\" IS NULL");

        // User role / seller approval fields added for admin/seller flows.
        safeExec("ALTER TABLE \"users\" ADD COLUMN IF NOT EXISTS \"role\" VARCHAR(255) DEFAULT 'CUSTOMER'");
        safeExec("UPDATE \"users\" SET \"role\" = 'CUSTOMER' WHERE \"role\" IS NULL");
        safeExec("ALTER TABLE \"users\" ADD COLUMN IF NOT EXISTS \"seller_approved\" BOOLEAN DEFAULT FALSE");
        safeExec("UPDATE \"users\" SET \"seller_approved\" = FALSE WHERE \"seller_approved\" IS NULL");
        safeExec("UPDATE \"users\" SET \"role\" = 'SELLER' WHERE \"seller_approved\" = TRUE AND \"role\" = 'CUSTOMER'");

        // Seller ownership linkage for products.
        safeExec("ALTER TABLE \"products\" ADD COLUMN IF NOT EXISTS \"seller_profile_id\" VARCHAR(255)");
    }

    private void safeExec(String sql) {
        try {
            jdbcTemplate.execute(sql);
        } catch (Exception ignored) {
            // Best-effort: if the table doesn't exist yet or the DB doesn't support IF NOT EXISTS
            // in some edge case, don't block app startup.
        }
    }
}
