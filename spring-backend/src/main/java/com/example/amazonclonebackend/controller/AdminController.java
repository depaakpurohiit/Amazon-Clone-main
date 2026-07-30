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
        List<com.example.amazonclonebackend.dto.SellerRequestDTO> all = sellerRequestRepository.findByStatus("PENDING").stream().map(r -> new com.example.amazonclonebackend.dto.SellerRequestDTO(
                r.getId(), 
                r.getRequester() != null ? r.getRequester().getId() : null, 
                r.getRequester() != null ? r.getRequester().getName() : null, 
                r.getRequester() != null ? r.getRequester().getEmail() : null, 
                r.getRequester() != null ? r.getRequester().getNumber() : null, 
                r.getMessage(), 
                r.getStatus(), 
                r.getCreatedAt()
        )).collect(java.util.stream.Collectors.toList());
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

        user.setRole(Role.MANAGER);
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

    @DeleteMapping("/notifications")
    public ResponseEntity<?> clearNotifications() {
        notificationService.clearAll();
        return ResponseEntity.ok("cleared");
    }

    @GetMapping("/sellers")
    public ResponseEntity<?> listSellers() {
        List<SellerProfile> profiles = sellerProfileRepository.findAll();
        List<User> managerUsers = userRepository.findByRole(Role.MANAGER);

        java.util.Map<String, com.example.amazonclonebackend.dto.SellerProfileDTO> map = new java.util.LinkedHashMap<>();

        for (SellerProfile profile : profiles) {
            String userId = profile.getUser() != null ? profile.getUser().getId() : null;
            String ownerName = profile.getUser() != null ? profile.getUser().getName() : "";
            String ownerEmail = profile.getUser() != null ? profile.getUser().getEmail() : "";
            String displayName = profile.getBusinessName();
            if (displayName == null || displayName.isBlank()) {
                displayName = ownerName.isBlank() ? "Seller Store" : (ownerName + "'s Store");
            }
            if (ownerName != null && !ownerName.isBlank() && !displayName.toLowerCase().contains(ownerName.toLowerCase())) {
                displayName = displayName + " (" + ownerName + ")";
            }

            com.example.amazonclonebackend.dto.SellerProfileDTO dto = new com.example.amazonclonebackend.dto.SellerProfileDTO(
                    profile.getId(),
                    userId != null ? userId : ownerEmail,
                    displayName,
                    profile.getBio() != null ? profile.getBio() : ("Seller Email: " + ownerEmail),
                    profile.getLogoUrl(),
                    profile.getStatus() != null ? profile.getStatus() : "APPROVED"
            );
            map.put(profile.getId(), dto);
        }

        for (User user : managerUsers) {
            boolean existing = profiles.stream().anyMatch(p -> p.getUser() != null && user.getId().equals(p.getUser().getId()));
            if (!existing) {
                String displayName = user.getName() + "'s Store (" + user.getName() + ")";
                com.example.amazonclonebackend.dto.SellerProfileDTO dto = new com.example.amazonclonebackend.dto.SellerProfileDTO(
                        user.getId(),
                        user.getId(),
                        displayName,
                        "Seller Email: " + user.getEmail() + " | Phone: " + user.getNumber(),
                        null,
                        "APPROVED"
                );
                map.put(user.getId(), dto);
            }
        }

        return ResponseEntity.ok(new java.util.ArrayList<>(map.values()));
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
        System.out.println("DEBUG: adminDeleteProduct called with id=" + id);
        try {
            // Check if product exists
            List<String> pList = entityManager.createQuery("SELECT p.id FROM Product p WHERE p.id = :id", String.class)
                                              .setParameter("id", id).getResultList();
            if (pList.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Delete from CartItem first to prevent FK violation
            int delCart = entityManager.createQuery("DELETE FROM CartItem c WHERE c.product.id = :id")
                                       .setParameter("id", id).executeUpdate();
            System.out.println("DEBUG: deleted " + delCart + " cart items for product " + id);
            
            // Delete the Product
            int delProd = entityManager.createQuery("DELETE FROM Product p WHERE p.id = :id")
                                       .setParameter("id", id).executeUpdate();
            System.out.println("DEBUG: deleted " + delProd + " product with id " + id);
            
            return ResponseEntity.ok(java.util.Map.of("status", "deleted"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(java.util.Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @org.springframework.beans.factory.annotation.Autowired
    private jakarta.persistence.EntityManager entityManager;

    @DeleteMapping("/sellers/{id}")
    @Transactional
    public ResponseEntity<?> deleteSeller(@PathVariable String id) {
        System.out.println("DEBUG: deleteSeller called with id=" + id);
        try {
            List<String> spList = entityManager.createQuery("SELECT s.user.id FROM SellerProfile s WHERE s.id = :id", String.class)
                                               .setParameter("id", id).getResultList();
            
            if (!spList.isEmpty()) {
                String userId = spList.get(0);
                
                // Delete CartItems for these products
                int delCartItems = entityManager.createQuery("DELETE FROM CartItem c WHERE c.product.sellerProfile.id = :id")
                                                .setParameter("id", id).executeUpdate();
                System.out.println("DEBUG: deleted " + delCartItems + " cart items for seller " + id);

                // Delist products
                int delProds = entityManager.createQuery("DELETE FROM Product p WHERE p.sellerProfile.id = :id")
                                            .setParameter("id", id).executeUpdate();
                System.out.println("DEBUG: deleted " + delProds + " products");
                
                // Update User
                entityManager.createQuery("UPDATE User u SET u.role = 'USER', u.sellerApproved = false WHERE u.id = :uid")
                             .setParameter("uid", userId).executeUpdate();
                
                // Delete SellerProfile
                int delSp = entityManager.createQuery("DELETE FROM SellerProfile s WHERE s.id = :id")
                                         .setParameter("id", id).executeUpdate();
                System.out.println("DEBUG: deleted " + delSp + " seller_profiles");
                
                return ResponseEntity.ok(java.util.Map.of("status", "removed"));
            } else {
                // If it's a user ID
                int updated = entityManager.createQuery("UPDATE User u SET u.role = 'USER', u.sellerApproved = false WHERE u.id = :uid")
                                           .setParameter("uid", id).executeUpdate();
                if (updated > 0) {
                    return ResponseEntity.ok(java.util.Map.of("status", "removed"));
                }
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(java.util.Map.of("status", "error", "message", e.getMessage()));
        }
    }

    public static class LiveUsersResponse {
        public int count;
        public List<String> users;

        public LiveUsersResponse(int count, List<String> users) { this.count = count; this.users = users; }
    }

}
