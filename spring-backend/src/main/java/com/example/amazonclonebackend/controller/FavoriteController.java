package com.example.amazonclonebackend.controller;

import com.example.amazonclonebackend.dto.ProductDTO;
import com.example.amazonclonebackend.entity.User;
import com.example.amazonclonebackend.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/me/favorites")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getMyFavorites(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(favoriteService.getFavoritesForUser(user));
    }

    @PostMapping
    public ResponseEntity<ProductDTO> addFavorite(@AuthenticationPrincipal User user, @RequestBody Map<String, String> body) {
        if (user == null) return ResponseEntity.status(401).build();
        String productId = body.get("productId");
        if (productId == null || productId.isBlank()) return ResponseEntity.badRequest().build();
        ProductDTO dto = favoriteService.addFavorite(user, productId);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Map<String, Object>> removeFavorite(@AuthenticationPrincipal User user, @PathVariable String productId) {
        if (user == null) return ResponseEntity.status(401).build();
        favoriteService.removeFavorite(user, productId);
        return ResponseEntity.ok(Map.of("status", true));
    }

}
