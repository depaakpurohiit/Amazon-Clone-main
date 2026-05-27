package com.example.amazonclonebackend.repository;

import com.example.amazonclonebackend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    boolean existsByUrl(String url);
}
