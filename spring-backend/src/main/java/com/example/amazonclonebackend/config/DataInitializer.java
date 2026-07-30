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
    private final com.example.amazonclonebackend.repository.SellerProfileRepository sellerProfileRepository;
    private final com.example.amazonclonebackend.repository.SellerRequestRepository sellerRequestRepository;

    public DataInitializer(UserRepository userRepository, 
                           PasswordEncoder passwordEncoder,
                           com.example.amazonclonebackend.repository.SellerProfileRepository sellerProfileRepository,
                           com.example.amazonclonebackend.repository.SellerRequestRepository sellerRequestRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.sellerProfileRepository = sellerProfileRepository;
        this.sellerRequestRepository = sellerRequestRepository;
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
                admin.setNumber(java.util.UUID.randomUUID().toString().substring(0, 10));
                userRepository.save(admin);
                log.info("Default admin user created successfully with alternate number.");
            }
        } else {
            log.info("Default admin user already exists.");
        }

        // Seed sample seller 1
        String seller1Email = "seller1@example.com";
        if (!userRepository.existsByEmail(seller1Email)) {
            User s1 = new User();
            s1.setName("TechGear Official");
            s1.setEmail(seller1Email);
            s1.setNumber("9876543211");
            s1.setPassword(passwordEncoder.encode("seller123"));
            s1.setRole(Role.MANAGER);
            s1.setSellerApproved(true);
            s1 = userRepository.save(s1);

            com.example.amazonclonebackend.entity.SellerProfile sp1 = new com.example.amazonclonebackend.entity.SellerProfile();
            sp1.setUser(s1);
            sp1.setBusinessName("TechGear Electronics Store");
            sp1.setBio("Authorized retailer for high-end audio and gaming peripherals.");
            sp1.setLogoUrl("https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg");
            sp1.setStatus("APPROVED");
            sellerProfileRepository.save(sp1);
            log.info("Sample seller 1 created.");
        }

        // Seed sample seller 2
        String seller2Email = "seller2@example.com";
        if (!userRepository.existsByEmail(seller2Email)) {
            User s2 = new User();
            s2.setName("Urban Edge Apparel");
            s2.setEmail(seller2Email);
            s2.setNumber("9876543212");
            s2.setPassword(passwordEncoder.encode("seller123"));
            s2.setRole(Role.MANAGER);
            s2.setSellerApproved(true);
            s2 = userRepository.save(s2);

            com.example.amazonclonebackend.entity.SellerProfile sp2 = new com.example.amazonclonebackend.entity.SellerProfile();
            sp2.setUser(s2);
            sp2.setBusinessName("Urban Edge Fashion Studio");
            sp2.setBio("Modern apparel, streetwear, and luxury fashion accessories.");
            sp2.setLogoUrl("https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg");
            sp2.setStatus("APPROVED");
            sellerProfileRepository.save(sp2);
            log.info("Sample seller 2 created.");
        }

        // Seed pending seller request
        String reqEmail = "applicant@example.com";
        if (!userRepository.existsByEmail(reqEmail)) {
            User applicant = new User();
            applicant.setName("ElectroHub Retail");
            applicant.setEmail(reqEmail);
            applicant.setNumber("9876543213");
            applicant.setPassword(passwordEncoder.encode("applicant123"));
            applicant.setRole(Role.USER);
            applicant.setSellerApproved(false);
            applicant = userRepository.save(applicant);

            com.example.amazonclonebackend.entity.SellerRequest sr = new com.example.amazonclonebackend.entity.SellerRequest();
            sr.setRequester(applicant);
            sr.setMessage("Requesting verification to launch ElectroHub Electronics Storefront on Trade Hive Marketplace.");
            sr.setStatus("PENDING");
            sellerRequestRepository.save(sr);
            log.info("Sample pending seller request created.");
        }
    }
}
