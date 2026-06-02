package com.example.amazonclonebackend.service;

import com.example.amazonclonebackend.dto.ProductDTO;
import com.example.amazonclonebackend.entity.Favorite;
import com.example.amazonclonebackend.entity.User;
import com.example.amazonclonebackend.repository.FavoriteRepository;
import com.example.amazonclonebackend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    public List<ProductDTO> getFavoritesForUser(User user) {
        return favoriteRepository.findAllByUserId(user.getId()).stream()
                .map(Favorite::getProduct)
                .map(p -> productService.getProductById(p.getId()).orElse(null))
                .filter(p -> p != null)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDTO addFavorite(User user, String productId) {
        productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        var existing = favoriteRepository.findByUserIdAndProductId(user.getId(), productId);
        if (existing.isPresent()) {
            return productService.getProductById(productId).orElseThrow();
        }

        Favorite fav = new Favorite();
        fav.setUser(user);
        fav.setProduct(productRepository.getReferenceById(productId));
        favoriteRepository.save(fav);

        return productService.getProductById(productId).orElseThrow();
    }

    @Transactional
    public void removeFavorite(User user, String productId) {
        favoriteRepository.findByUserIdAndProductId(user.getId(), productId)
                .ifPresent(favoriteRepository::delete);
    }

}
