package com.example.amazonclonebackend.service;

import com.example.amazonclonebackend.dto.CartItemDTO;
import com.example.amazonclonebackend.entity.CartItem;
import com.example.amazonclonebackend.entity.Product;
import com.example.amazonclonebackend.entity.User;
import com.example.amazonclonebackend.repository.CartItemRepository;
import com.example.amazonclonebackend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Transactional
    public void addToCart(User user, String productId) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found");
        }

        Product product = productOpt.get();
        Optional<CartItem> existingItem = cartItemRepository.findByUserAndProductId(user, productId);

        if (existingItem.isPresent()) {
            CartItem cartItem = existingItem.get();
            cartItem.setQty(cartItem.getQty() + 1);
            cartItemRepository.save(cartItem);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setQty(1);
            cartItemRepository.save(cartItem);
        }
    }

    @Transactional
    public void removeFromCart(User user, String productId) {
        cartItemRepository.deleteByUserAndProductId(user, productId);
    }

    @Transactional
    public void updateCartQuantity(User user, String productId, Integer qty) {
        if (qty < 1) {
            throw new RuntimeException("Invalid quantity");
        }

        Optional<CartItem> cartItemOpt = cartItemRepository.findByUserAndProductId(user, productId);
        if (cartItemOpt.isEmpty()) {
            throw new RuntimeException("Item not found in cart");
        }

        CartItem cartItem = cartItemOpt.get();
        cartItem.setQty(qty);
        cartItemRepository.save(cartItem);
    }

    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }

    public List<CartItemDTO> getCartItemsForUser(User user) {
        return cartItemRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CartItemDTO convertToDTO(CartItem cartItem) {
        return new CartItemDTO(
                cartItem.getProduct().getId(),
                cartItem.getProduct().getName(),
                cartItem.getProduct().getUrl(),
                cartItem.getProduct().getPrice(),
                cartItem.getQty()
        );
    }

}