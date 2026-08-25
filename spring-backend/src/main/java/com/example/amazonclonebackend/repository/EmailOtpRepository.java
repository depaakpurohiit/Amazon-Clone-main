package com.example.amazonclonebackend.repository;

import com.example.amazonclonebackend.entity.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailOtpRepository extends JpaRepository<EmailOtp, String> {

    Optional<EmailOtp> findFirstByEmailIgnoreCaseAndIsVerifiedFalseOrderByCreatedAtDesc(String email);

    void deleteByEmail(String email);
}
