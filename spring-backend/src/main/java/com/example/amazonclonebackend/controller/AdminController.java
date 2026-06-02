package com.example.amazonclonebackend.controller;

import com.example.amazonclonebackend.entity.*;
import com.example.amazonclonebackend.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final SellerRequestRepository sellerRequestRepository;
    private final com.example.amazonclonebackend.service.NotificationService notificationService;
    private final SellerProfileRepository sellerProfileRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ActiveSessionRepository activeSessionRepository;

    @GetMapping("/seller-requests")
    public ResponseEntity<?> listSellerRequests() {
        List<com.example.amazonclonebackend.dto.SellerRequestDTO> all = sellerRequestRepository.findAll().stream().map(r -> new com.example.amazonclonebackend.dto.SellerRequestDTO(r.getId(), r.getRequester() != null ? r.getRequester().getId() : null, r.getMessage(), r.getStatus(), r.getCreatedAt())).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(all);
    }

    @PostMapping("/seller-requests/{id}/approve")
    @Transactional
    public ResponseEntity<?> approveRequest(@PathVariable String id, HttpServletRequest request) {
        Optional<SellerRequest> reqOpt = sellerRequestRepository.findById(id);
        if (reqOpt.isEmpty()) return ResponseEntity.notFound().build();

        SellerRequest req = reqOpt.get();
        req.setStatus("APPROVED");
        sellerRequestRepository.save(req);

        User user = req.getRequester();
        // create SellerProfile if missing
        SellerProfile profile = sellerProfileRepository.findByUserId(user.getId()).orElseGet(() -> {
            SellerProfile p = new SellerProfile();
            p.setUser(user);
            p.setBusinessName(user.getName() + "'s Store");
            p.setStatus("APPROVED");
            return p;
        });
        profile.setStatus("APPROVED");
        sellerProfileRepository.save(profile);

        user.setRole(Role.SELLER);
        user.setSellerApproved(true);
        userRepository.save(user);

        notificationService.createNotification("SELLER_REQUEST_APPROVED", "{\"userId\":\"" + user.getId() + "\"}");

        return ResponseEntity.ok("approved");
    }

    @PostMapping("/seller-requests/{id}/reject")
    @Transactional
    public ResponseEntity<?> rejectRequest(@PathVariable String id) {
        Optional<SellerRequest> reqOpt = sellerRequestRepository.findById(id);
        if (reqOpt.isEmpty()) return ResponseEntity.notFound().build();

        SellerRequest req = reqOpt.get();
        req.setStatus("REJECTED");
        sellerRequestRepository.save(req);

        notificationService.createNotification("SELLER_REQUEST_REJECTED", "{\"requestId\":\"" + req.getId() + "\"}");

        return ResponseEntity.ok("rejected");
    }

    @GetMapping("/notifications")
    public ResponseEntity<?> listNotifications() {
        return ResponseEntity.ok(notificationService.listAll());
    }

    @GetMapping("/sellers")
    public ResponseEntity<?> listSellers() {
        List<com.example.amazonclonebackend.dto.SellerProfileDTO> sellers = sellerProfileRepository.findAll().stream()
                .map(profile -> new com.example.amazonclonebackend.dto.SellerProfileDTO(
                        profile.getId(),
                        profile.getUser() != null ? profile.getUser().getId() : null,
                        profile.getBusinessName(),
                        profile.getBio(),
                        profile.getLogoUrl(),
                        profile.getStatus()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(sellers);
    }

    @GetMapping("/live-users")
    public ResponseEntity<?> liveUsers() {
        // consider active in last 5 minutes
        List<ActiveSession> active = activeSessionRepository.findByLastSeenAfter(LocalDateTime.now().minusMinutes(5));
        List<String> users = active.stream().map(s -> s.getUser() != null ? s.getUser().getId() : null).collect(Collectors.toList());
        return ResponseEntity.ok(new LiveUsersResponse(users.size(), users));
    }

    @PutMapping("/products/{id}")
    @Transactional
    public ResponseEntity<?> adminUpdateProduct(@PathVariable String id, @RequestBody Object body) {
        Optional<Product> pOpt = productRepository.findById(id);
        if (pOpt.isEmpty()) return ResponseEntity.notFound().build();
        // For admin convenience we allow admins to update minimal fields via request body map.
        // Leave detailed implementation for later.
        return ResponseEntity.ok("ok");
    }

    @DeleteMapping("/products/{id}")
    @Transactional
    public ResponseEntity<?> adminDeleteProduct(@PathVariable String id) {
        Optional<Product> pOpt = productRepository.findById(id);
        if (pOpt.isEmpty()) return ResponseEntity.notFound().build();
        productRepository.delete(pOpt.get());
        return ResponseEntity.ok("deleted");
    }

    @DeleteMapping("/sellers/{id}")
    @Transactional
    public ResponseEntity<?> deleteSeller(@PathVariable String id) {
        Optional<SellerProfile> spOpt = sellerProfileRepository.findById(id);
        if (spOpt.isEmpty()) return ResponseEntity.notFound().build();
        SellerProfile sp = spOpt.get();
        User user = sp.getUser();
        // Demote user
        user.setRole(Role.CUSTOMER);
        user.setSellerApproved(false);
        userRepository.save(user);
        // remove profile
        sellerProfileRepository.delete(sp);
        return ResponseEntity.ok("removed");
    }

    public static class LiveUsersResponse {
        public int count;
        public List<String> users;

        public LiveUsersResponse(int count, List<String> users) { this.count = count; this.users = users; }
    }

}
