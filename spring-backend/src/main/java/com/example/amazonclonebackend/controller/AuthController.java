package com.example.amazonclonebackend.controller;

import com.example.amazonclonebackend.dto.LoginRequest;
import com.example.amazonclonebackend.dto.RegisterRequest;
import com.example.amazonclonebackend.entity.User;
import com.example.amazonclonebackend.service.JwtService;
import com.example.amazonclonebackend.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            log.info(
                    "Register endpoint payload email={} accountType={} role={}",
                    request.getEmail(),
                    request.getAccountType(),
                    request.getRole()
            );
            User user = userService.registerUser(request);
            log.info(
                    "Register endpoint saved user id={} email={} role={} sellerApproved={}",
                    user.getId(),
                    user.getEmail(),
                    user.getRole(),
                    user.getSellerApproved()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("status", true);
            response.put("message", "User registered successfully");

            return ResponseEntity.status(201).body(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", false);
            response.put("message", new Object[]{Map.of("msg", e.getMessage())});

            return ResponseEntity.status(400).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request,
                                                   HttpServletResponse response) {
        try {
            log.info("Login attempt for email={}", request.getEmail());
            User user = userService.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Incorrect Email or Password"));

            boolean ok = userService.authenticate(user, request.getPassword());
            log.info("Authentication result for userId={} : {}", user.getId(), ok);
            if (!ok) {
                log.warn("Failed login for email={}", request.getEmail());
                throw new RuntimeException("Incorrect Email or Password");
            }

            // Generate token
            String token = jwtService.generateToken(user);
            jwtService.saveUserToken(user, token);

            ResponseCookie cookie = ResponseCookie.from("AmazonClone", token)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .sameSite("Lax")
                    .maxAge(3600)
                    .build();

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("status", true);
            responseBody.put("message", "Logged in successfully!");

            return ResponseEntity.status(201)
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(responseBody);
        } catch (RuntimeException e) {
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("status", false);
            responseBody.put("message", new Object[]{Map.of("msg", e.getMessage())});

            return ResponseEntity.status(400).body(responseBody);
        }
    }

}
