package com.example.amazonclonebackend.controller;

import com.example.amazonclonebackend.entity.User;
import com.example.amazonclonebackend.dto.compat.CompatAuthUserDTO;
import com.example.amazonclonebackend.service.CompatAuthUserService;
import com.example.amazonclonebackend.service.JwtService;
import com.example.amazonclonebackend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;
    private final CompatAuthUserService compatAuthUserService;

    @GetMapping("/getAuthUser")
    public ResponseEntity<CompatAuthUserDTO> getAuthenticatedUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(compatAuthUserService.build(user));
    }

    @PutMapping("/profile/address")
    public ResponseEntity<Map<String, Object>> updateAddress(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> payload) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        
        try {
            String address = (String) payload.get("address");
            Double lat = payload.get("lat") != null ? Double.parseDouble(payload.get("lat").toString()) : null;
            Double lng = payload.get("lng") != null ? Double.parseDouble(payload.get("lng").toString()) : null;
            
            userService.updateUserAddress(user, address, lat, lng);
            return ResponseEntity.ok(Map.of("status", true, "message", "Address updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@AuthenticationPrincipal User user,
                                                    HttpServletRequest request,
                                                    HttpServletResponse response) {
        try {
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("status", false, "message", "Not authenticated"));
            }
            // Remove all tokens for user
            jwtService.removeUserTokens(user);

            ResponseCookie cookie = ResponseCookie.from("AmazonClone", "")
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .sameSite("Lax")
                    .maxAge(0)
                    .build();

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("status", true);
            responseBody.put("message", "Logged out successfully!");

            return ResponseEntity.status(201)
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(responseBody);
        } catch (Exception e) {
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("status", false);
            responseBody.put("message", e.getMessage());

            return ResponseEntity.status(400).body(responseBody);
        }
    }

}
