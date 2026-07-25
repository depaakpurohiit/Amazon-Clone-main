// ============================================
// Application.java - Main Spring Boot Application
// ============================================
package com.example.logvisualization;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// ============================================
// LogGeneratorController.java - REST Controller
// ============================================
package com.example.logvisualization.controller;

import com.example.logvisualization.service.LogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api")
public class LogGeneratorController {

    private static final Logger logger = LoggerFactory.getLogger(LogGeneratorController.class);
    private final Random random = new Random();

    @Autowired
    private LogService logService;

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testEndpoint() {
        logger.info("Test endpoint called - Request received");
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Test endpoint is working");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        
        logger.info("Test endpoint - Response sent successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/error")
    public ResponseEntity<Map<String, String>> errorEndpoint() {
        logger.error("Error endpoint called - Simulating error scenario");
        
        try {
            // Simulate various error scenarios
            int errorType = random.nextInt(3);
            
            switch (errorType) {
                case 0:
                    throw new RuntimeException("Database connection timeout");
                case 1:
                    throw new IllegalArgumentException("Invalid input parameter");
                case 2:
                    throw new NullPointerException("Null reference exception");
            }
        } catch (Exception e) {
            logger.error("Exception occurred: {} - {}", e.getClass().getSimpleName(), 
                        e.getMessage(), e);
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("error", e.getMessage());
            errorResponse.put("type", e.getClass().getSimpleName());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(errorResponse);
        }
        
        return ResponseEntity.ok(new HashMap<>());
    }

    @GetMapping("/warning")
    public ResponseEntity<Map<String, String>> warningEndpoint() {
        logger.warn("Warning endpoint called - Potential issue detected");
        
        // Simulate warnings
        String[] warnings = {
            "Memory usage above 75%",
            "Response time exceeded threshold",
            "API rate limit approaching",
            "Cache hit ratio below optimal"
        };
        
        String warning = warnings[random.nextInt(warnings.length)];
        logger.warn("System warning: {}", warning);
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "warning");
        response.put("message", warning);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/performance")
    public ResponseEntity<Map<String, Object>> performanceEndpoint() {
        long startTime = System.currentTimeMillis();
        
        logger.info("Performance endpoint called - Starting operation");
        
        try {
            // Simulate processing time
            int processingTime = random.nextInt(1000) + 100;
            Thread.sleep(processingTime);
            
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;
            
            logger.info("Performance endpoint - Operation completed in {}ms", duration);
            
            if (duration > 500) {
                logger.warn("Performance degradation detected - Response time: {}ms", duration);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("duration_ms", duration);
            response.put("timestamp", endTime);
            
            return ResponseEntity.ok(response);
            
        } catch (InterruptedException e) {
            logger.error("Performance endpoint - Thread interrupted", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/process")
    public ResponseEntity<Map<String, String>> processData(@RequestBody Map<String, Object> data) {
        logger.info("Process endpoint called with data: {}", data);
        
        try {
            // Validate input
            if (data == null || data.isEmpty()) {
                logger.warn("Process endpoint - Empty or null data received");
                return ResponseEntity.badRequest().build();
            }
            
            // Simulate data processing
            logger.debug("Processing data with {} fields", data.size());
            
            Map<String, String> response = new HashMap<>();
            response.put("status", "processed");
            response.put("records", String.valueOf(data.size()));
            
            logger.info("Process endpoint - Data processed successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Process endpoint - Error processing data: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        logger.debug("Health check endpoint called");
        
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("application", "Log Visualization Demo");
        health.put("version", "1.0.0");
        
        return ResponseEntity.ok(health);
    }
}

// ============================================
// LogService.java - Service for Log Generation
// ============================================
package com.example.logvisualization.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class LogService {

    private static final Logger logger = LoggerFactory.getLogger(LogService.class);
    private final Random random = new Random();
    private int requestCount = 0;

    /**
     * Generate logs every 5 seconds automatically
     */
    @Scheduled(fixedRate = 5000)
    public void generatePeriodicLogs() {
        requestCount++;
        
        int logType = random.nextInt(10);
        
        if (logType < 6) {
            // 60% INFO logs
            logger.info("Scheduled log generation #{} - System operating normally", requestCount);
            logger.info("Active connections: {}, Memory usage: {}MB", 
                       random.nextInt(100), random.nextInt(1024));
        } else if (logType < 8) {
            // 20% WARN logs
            logger.warn("Scheduled log generation #{} - Warning detected", requestCount);
            logger.warn("Resource utilization high: CPU {}%, Memory {}%", 
                       random.nextInt(40) + 60, random.nextInt(30) + 70);
        } else if (logType < 9) {
            // 10% ERROR logs
            logger.error("Scheduled log generation #{} - Error encountered", requestCount);
            String[] errors = {
                "Connection pool exhausted",
                "Timeout waiting for response",
                "Failed to process request",
                "Database query failed"
            };
            logger.error("Error details: {}", errors[random.nextInt(errors.length)]);
        } else {
            // 10% DEBUG logs
            logger.debug("Scheduled log generation #{} - Debug information", requestCount);
            logger.debug("Thread pool status: Active={}, Queued={}", 
                        random.nextInt(20), random.nextInt(50));
        }
        
        // Simulate different application events
        if (requestCount % 10 == 0) {
            logger.info("Milestone reached: {} log generations completed", requestCount);
        }
        
        if (requestCount % 20 == 0) {
            logger.warn("System check: Running for {} cycles", requestCount);
        }
    }

    /**
     * Simulate business operations
     */
    @Scheduled(fixedRate = 15000)
    public void simulateBusinessOperations() {
        String[] operations = {
            "User authentication",
            "Data synchronization",
            "Report generation",
            "Cache refresh",
            "Backup operation"
        };
        
        String operation = operations[random.nextInt(operations.length)];
        logger.info("Business operation started: {}", operation);
        
        try {
            // Simulate processing
            Thread.sleep(random.nextInt(2000));
            
            if (random.nextInt(10) < 8) {
                logger.info("Business operation completed successfully: {}", operation);
            } else {
                logger.error("Business operation failed: {} - Retry scheduled", operation);
            }
        } catch (InterruptedException e) {
            logger.error("Business operation interrupted: {}", operation, e);
        }
    }

    /**
     * Simulate API metrics
     */
    @Scheduled(fixedRate = 10000)
    public void logAPIMetrics() {
        int totalRequests = random.nextInt(1000) + 500;
        int successfulRequests = (int) (totalRequests * 0.95);
        int failedRequests = totalRequests - successfulRequests;
        double avgResponseTime = random.nextDouble() * 500 + 100;
        
        logger.info("API Metrics - Total Requests: {}, Success: {}, Failed: {}", 
                   totalRequests, successfulRequests, failedRequests);
        logger.info("API Metrics - Average Response Time: {:.2f}ms", avgResponseTime);
        
        if (avgResponseTime > 400) {
            logger.warn("API performance degradation detected - Avg response time: {:.2f}ms", 
                       avgResponseTime);
        }
    }
}

// ============================================
// GlobalExceptionHandler.java - Exception Handler
// ============================================
package com.example.logvisualization.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGlobalException(
            Exception ex, WebRequest request) {
        
        logger.error("Global exception handler caught exception: {} at path: {}", 
                    ex.getMessage(), request.getDescription(false), ex);
        
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getMessage());
        errorResponse.put("status", "error");
        errorResponse.put("path", request.getDescription(false));
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                           .body(errorResponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {
        
        logger.error("Invalid argument exception: {} at path: {}", 
                    ex.getMessage(), request.getDescription(false));
        
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getMessage());
        errorResponse.put("status", "bad_request");
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}
