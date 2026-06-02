package com.example.amazonclonebackend.repository;

import com.example.amazonclonebackend.entity.ActiveSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ActiveSessionRepository extends JpaRepository<ActiveSession, String> {
    List<ActiveSession> findByLastSeenAfter(LocalDateTime since);
    Optional<ActiveSession> findBySessionId(String sessionId);
}
