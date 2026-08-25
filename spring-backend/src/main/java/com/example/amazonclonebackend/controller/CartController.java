package com.example.amazonclonebackend.controller;

import com.example.amazonclonebackend.entity.User;
import com.example.amazonclonebackend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CartController {

    private final CartService cartService;

    @PostMapping("/addtocart/{id}")
    public ResponseEntity<Map<String, Object>> addToCart(@PathVariable String id,
                                                       @AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("status", false, "message", "Not authenticated"));
            }
            cartService.addToCart(user, id);

            Map<String, Object> response = new HashMap<>();
            response.put("status", true);
            response.put("message", "Added to cart");

            return ResponseEntity.status(201).body(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", false);
            response.put("message", e.getMessage());

            return ResponseEntity.status(400).body(response);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> removeFromCart(@PathVariable String id,
                                                            @AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("status", false, "message", "Not authenticated"));
            }
            cartService.removeFromCart(user, id);

            Map<String, Object> response = new HashMap<>();
            response.put("status", true);
            response.put("message", "Item deleted successfully");

            return ResponseEntity.status(201).body(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", false);
            response.put("message", e.getMessage());

            return ResponseEntity.status(400).body(response);
        }
    }

    @RequestMapping(value = "/update-qty/{id}", method = {RequestMethod.PATCH, RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<Map<String, Object>> updateQuantity(@PathVariable String id,
                                                            @RequestParam Integer qty,
                                                            @AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("status", false, "message", "Not authenticated"));
            }
            cartService.updateCartQuantity(user, id, qty);

            Map<String, Object> response = new HashMap<>();
            response.put("status", true);
            response.put("message", "Quantity updated");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", false);
            response.put("message", e.getMessage());

            return ResponseEntity.status(400).body(response);
        }
    }

}
