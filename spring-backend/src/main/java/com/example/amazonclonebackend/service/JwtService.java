package com.example.amazonclonebackend.service;

import com.example.amazonclonebackend.entity.User;
import com.example.amazonclonebackend.entity.UserToken;
import com.example.amazonclonebackend.repository.UserTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Key;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    private final UserTokenRepository userTokenRepository;

    private Key signingKey;

    @PostConstruct
    private void initSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException(
                    "JWT secret key is too short for HS256. It must be at least 32 bytes (256 bits). " +
                            "Set a strong value via the JWT_SECRET environment variable or in application.properties."
            );
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    private Key getSigningKey() {
        return signingKey;
    }

    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .setSubject(user.getId())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public void saveUserToken(User user, String token) {
        UserToken userToken = new UserToken();
        userToken.setUser(user);
        userToken.setToken(token);
        userTokenRepository.save(userToken);
    }

    public Optional<UserToken> findByToken(String token) {
        return userTokenRepository.findByToken(token);
    }

    @Transactional
    public void removeUserTokens(User user) {
        userTokenRepository.deleteByUser(user);
    }

}
