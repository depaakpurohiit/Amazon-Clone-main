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

    @Lazy
    @Autowired
    private CartService cartService;

    @Lazy
    @Autowired
    private OrderService orderService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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

    private Role parseRole(String accountType, String role) {
        String normalizedAccountType = normalizeRoleValue(accountType);
        String normalizedRole = normalizeRoleValue(role);

        if ("SELLER".equals(normalizedAccountType) || "SELLER".equals(normalizedRole)) {
            return Role.SELLER;
        }
        if ("ADMIN".equals(normalizedAccountType) || "ADMIN".equals(normalizedRole)) {
            return Role.ADMIN;
        }
        return Role.CUSTOMER;
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

}
