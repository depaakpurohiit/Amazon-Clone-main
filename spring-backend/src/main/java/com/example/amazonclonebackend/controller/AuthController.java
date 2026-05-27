package com.example.amazonclonebackend.controller;

import com.example.amazonclonebackend.dto.LoginRequest;
import com.example.amazonclonebackend.dto.RegisterRequest;
import com.example.amazonclonebackend.entity.User;
import com.example.amazonclonebackend.service.JwtService;
import com.example.amazonclonebackend.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(request);

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
            User user = userService.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Incorrect Email or Password"));

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
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
