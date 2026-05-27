package com.example.amazonclonebackend.repository;

import com.example.amazonclonebackend.entity.User;
import com.example.amazonclonebackend.entity.UserToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserTokenRepository extends JpaRepository<UserToken, Long> {

    Optional<UserToken> findByToken(String token);

    void deleteByUser(User user);

}