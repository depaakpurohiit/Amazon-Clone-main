package com.example.amazonclonebackend.repository;

import com.example.amazonclonebackend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    boolean existsByUrl(String url);

    List<Product> findAllBySellerProfileId(String sellerProfileId);
    java.util.Optional<Product> findByName(String name);
}
