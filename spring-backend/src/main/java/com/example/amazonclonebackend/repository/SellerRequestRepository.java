package com.example.amazonclonebackend.repository;

import com.example.amazonclonebackend.entity.SellerRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SellerRequestRepository extends JpaRepository<SellerRequest, String> {
    List<SellerRequest> findByStatus(String status);
}
