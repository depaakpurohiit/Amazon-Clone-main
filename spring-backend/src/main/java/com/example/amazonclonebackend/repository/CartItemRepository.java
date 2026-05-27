package com.example.amazonclonebackend.repository;

import com.example.amazonclonebackend.entity.CartItem;
import com.example.amazonclonebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndProductId(User user, String productId);

    void deleteByUserAndProductId(User user, String productId);

    void deleteByUser(User user);

}