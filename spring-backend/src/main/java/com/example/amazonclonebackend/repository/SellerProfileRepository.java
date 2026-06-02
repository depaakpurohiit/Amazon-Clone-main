package com.example.amazonclonebackend.repository;

import com.example.amazonclonebackend.entity.SellerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerProfileRepository extends JpaRepository<SellerProfile, String> {
    Optional<SellerProfile> findByUserId(String userId);
}
