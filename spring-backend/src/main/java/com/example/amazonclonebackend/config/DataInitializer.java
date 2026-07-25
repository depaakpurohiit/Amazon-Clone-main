package com.example.amazonclonebackend.config;

import com.example.amazonclonebackend.entity.Role;
import com.example.amazonclonebackend.entity.User;
import com.example.amazonclonebackend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        String adminEmail = "mainadmin@@1212";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName("Main Admin");
            admin.setEmail(adminEmail);
            admin.setNumber(java.util.UUID.randomUUID().toString().substring(0, 10));
            admin.setPassword(passwordEncoder.encode("adminadmin@@"));
            admin.setRole(Role.ADMIN);
            admin.setSellerApproved(true);
            try {
                userRepository.save(admin);
                log.info("Default admin user created successfully.");
            } catch (Exception e) {
                log.warn("Could not create default admin user (possibly unique constraint on number). Setting random number.");
                admin.setNumber(java.util.UUID.randomUUID().toString().substring(0, 10));
                userRepository.save(admin);
                log.info("Default admin user created successfully with alternate number.");
            }
        } else {
            log.info("Default admin user already exists.");
        }
    }
}
