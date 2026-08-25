package com.example.amazonclonebackend.service;

import com.example.amazonclonebackend.dto.RegisterRequest;
import com.example.amazonclonebackend.dto.UserDTO;
import com.example.amazonclonebackend.entity.User;
import com.example.amazonclonebackend.entity.Role;
import com.example.amazonclonebackend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.example.amazonclonebackend.repository.EmailOtpRepository emailOtpRepository;
    private final EmailService emailService;

    @Lazy
    @Autowired
    private CartService cartService;

    @Lazy
    @Autowired
    private OrderService orderService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       com.example.amazonclonebackend.repository.EmailOtpRepository emailOtpRepository,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailOtpRepository = emailOtpRepository;
        this.emailService = emailService;
    }

    @Transactional
    public User registerUser(RegisterRequest request) {
        final String email = request.getEmail().trim().toLowerCase();
        final String number = request.getNumber().trim();
        final Role requestedRole = parseRole(request.getAccountType(), request.getRole());

        if (requestedRole == Role.ADMIN) {
            throw new RuntimeException("Cannot register as Admin. Admin account is pre-configured.");
        }

        log.info(
                "Register request received email={} accountType={} role={} resolvedRole={}",
                email,
                request.getAccountType(),
                request.getRole(),
                requestedRole
        );

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.existsByNumber(number)) {
            throw new RuntimeException("Number already registered");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords don't match");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setNumber(number);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(requestedRole);
        user.setSellerApproved(Boolean.FALSE);

        User saved = userRepository.save(user);
        if (saved.getRole() != requestedRole) {
            log.warn(
                    "Role mismatch after save for email={} requestedRole={} savedRole={}; re-saving with requested role",
                    email,
                    requestedRole,
                    saved.getRole()
            );
            saved.setRole(requestedRole);
            saved = userRepository.save(saved);
        }

        log.info(
                "Register persisted email={} assignedRole={} sellerApproved={}",
                saved.getEmail(),
                saved.getRole(),
                saved.getSellerApproved()
        );

        return saved;
    }

    @Transactional
    public void generateAndSendRegistrationOtp(RegisterRequest request) {
        final String email = request.getEmail().trim().toLowerCase();
        final String number = request.getNumber().trim();
        final Role requestedRole = parseRole(request.getAccountType(), request.getRole());

        if (requestedRole == Role.ADMIN) {
            throw new RuntimeException("Cannot register as Admin. Admin account is pre-configured.");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.existsByNumber(number)) {
            throw new RuntimeException("Number already registered");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords don't match");
        }
        if (request.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters long");
        }

        // Generate 6-digit numeric OTP
        int randomCode = new java.security.SecureRandom().nextInt(900000) + 100000;
        String otpCode = String.valueOf(randomCode);

        // Remove any old unverified OTPs for this email
        emailOtpRepository.findFirstByEmailIgnoreCaseAndIsVerifiedFalseOrderByCreatedAtDesc(email).ifPresent(old -> {
            emailOtpRepository.delete(old);
        });

        com.example.amazonclonebackend.entity.EmailOtp emailOtp = new com.example.amazonclonebackend.entity.EmailOtp();
        emailOtp.setEmail(email);
        emailOtp.setOtp(otpCode);
        emailOtp.setName(request.getName().trim());
        emailOtp.setNumber(number);
        emailOtp.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        emailOtp.setRole(requestedRole);
        emailOtp.setAccountType(request.getAccountType());
        emailOtp.setExpiresAt(java.time.LocalDateTime.now().plusMinutes(10));
        emailOtp.setIsVerified(false);

        emailOtpRepository.save(emailOtp);

        // Send email via Brevo SMTP
        emailService.sendOtpEmail(email, request.getName().trim(), otpCode);
    }

    @Transactional
    public User verifyOtpAndRegisterUser(String rawEmail, String otp) {
        final String email = rawEmail.trim().toLowerCase();
        final String trimmedOtp = otp.trim();

        com.example.amazonclonebackend.entity.EmailOtp emailOtp = emailOtpRepository.findFirstByEmailIgnoreCaseAndIsVerifiedFalseOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new RuntimeException("No active verification code found for this email. Please request a new code."));

        if (emailOtp.getExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Verification code has expired. Please request a new code.");
        }

        if (!emailOtp.getOtp().equals(trimmedOtp)) {
            throw new RuntimeException("Invalid verification code. Please check your email and try again.");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.existsByNumber(emailOtp.getNumber())) {
            throw new RuntimeException("Number already registered");
        }

        // Mark OTP as verified/used
        emailOtp.setIsVerified(true);
        emailOtpRepository.save(emailOtp);

        // Create new User entity
        User user = new User();
        user.setName(emailOtp.getName());
        user.setNumber(emailOtp.getNumber());
        user.setEmail(email);
        user.setPassword(emailOtp.getPasswordHash());
        user.setRole(emailOtp.getRole());
        user.setSellerApproved(Boolean.FALSE);

        User saved = userRepository.save(user);

        log.info(
                "User successfully verified and registered via OTP email={} role={} id={}",
                saved.getEmail(),
                saved.getRole(),
                saved.getId()
        );

        return saved;
    }

    private Role parseRole(String accountType, String role) {
        String normalizedAccountType = normalizeRoleValue(accountType);
        String normalizedRole = normalizeRoleValue(role);

        if ("MANAGER".equals(normalizedAccountType) || "MANAGER".equals(normalizedRole)) {
            return Role.MANAGER;
        }
        if ("ADMIN".equals(normalizedAccountType) || "ADMIN".equals(normalizedRole)) {
            return Role.ADMIN;
        }
        return Role.USER;
    }

    private String normalizeRoleValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim().toUpperCase().replaceFirst("^ROLE_", "");
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase());
    }

    @Transactional
    public boolean authenticate(User user, String rawPassword) {
        String storedPassword = user.getPassword();
        boolean bcryptMatch = passwordEncoder.matches(rawPassword, storedPassword);
        boolean legacyMatch = false;

        if (bcryptMatch) {
            log.info("Password bcrypt match for userId={}", user.getId());
            return true;
        }

        if (isLegacyPlainPassword(storedPassword) && storedPassword.equals(rawPassword)) {
            legacyMatch = true;
            user.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
            log.info("Legacy plaintext password re-hash for userId={}", user.getId());
            return true;
        }

        log.info("Password mismatch for userId={} bcryptMatch={} legacyMatch={}", user.getId(), bcryptMatch, legacyMatch);
        return false;
    }

    private boolean isLegacyPlainPassword(String storedPassword) {
        if (storedPassword == null) {
            return false;
        }
        return !(storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$"));
    }

    public Optional<UserDTO> getUserDTOById(String id) {
        return userRepository.findById(id)
                .map(this::convertToDTO);
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getNumber(),
                user.getEmail(),
                user.getCreatedAt(),
                cartService.getCartItemsForUser(user),
                orderService.getOrdersForUser(user)
        );
    }

    @Transactional
    public void updateUserAddress(User user, String address, Double lat, Double lng) {
        user.setAddress(address);
        user.setLat(lat);
        user.setLng(lng);
        userRepository.save(user);
    }
}
