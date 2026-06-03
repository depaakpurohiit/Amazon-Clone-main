@echo off
cd /d "%~dp0"
set "FLYWAY_URL=jdbc:postgresql://ep-misty-rain-apff0rak-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
set "FLYWAY_USER=neondb_owner"
set "FLYWAY_PASS=%DB_PASSWORD%"
call mvnw.cmd -Dflyway.url="%FLYWAY_URL%" -Dflyway.user="%FLYWAY_USER%" -Dflyway.password="%FLYWAY_PASS%" flyway:repair
