package com.example.amazonclonebackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import de.codecentric.boot.admin.server.config.EnableAdminServer;

@SpringBootApplication
@EnableAdminServer
public class AmazonCloneBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(AmazonCloneBackendApplication.class, args);
    }

}