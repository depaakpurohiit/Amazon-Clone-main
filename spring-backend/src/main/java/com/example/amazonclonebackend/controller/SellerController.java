package com.example.amazonclonebackend.controller;

import com.example.amazonclonebackend.dto.ProductDTO;
import com.example.amazonclonebackend.dto.SellerProfileDTO;
import com.example.amazonclonebackend.entity.*;
import com.example.amazonclonebackend.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerController {

    private final SellerRequestRepository sellerRequestRepository;
    private final com.example.amazonclonebackend.service.NotificationService notificationService;
    private final SellerProfileRepository sellerProfileRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @PostMapping("/request")
    @Transactional
    public ResponseEntity<?> createSellerRequest(@RequestBody SellerRequestBody body, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("Unauthenticated");

        SellerRequest sr = new SellerRequest();
        sr.setRequester(user);
        sr.setMessage(body.getMessage());
        sr.setStatus("PENDING");
        sellerRequestRepository.save(sr);

        notificationService.createNotification("SELLER_REQUEST", "{\"requestId\":\"" + sr.getId() + "\",\"userId\":\"" + user.getId() + "\"}");

        return ResponseEntity.ok(new CreateRequestResponse(sr.getId()));
    }

    @PostMapping("/products")
    @Transactional
    public ResponseEntity<?> createProduct(@RequestBody ProductDTO dto, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("Unauthenticated");

        // Only sellers or admins can create products
        if (!(user.getRole() == Role.MANAGER || user.getRole() == Role.ADMIN)) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        if (user.getRole() == Role.MANAGER && !Boolean.TRUE.equals(user.getSellerApproved())) {
            return ResponseEntity.status(403).body("Seller not approved");
        }

        Optional<SellerProfile> profileOpt = sellerProfileRepository.findByUserId(user.getId());
        if (profileOpt.isEmpty() && user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(400).body("Seller profile missing");
        }

        Product p = new Product();
        p.setId(UUID.randomUUID().toString());
        p.setUrl(dto.getUrl());
        p.setResUrl(dto.getResUrl());
        p.setPrice(dto.getPrice());
        p.setValue(dto.getValue());
        p.setAccValue(dto.getAccValue());
        p.setDiscount(dto.getDiscount());
        p.setMrp(dto.getMrp());
        p.setName(dto.getName());
        p.setCategory(dto.getCategory());
        p.setBestSeller(false);
        p.setTodayDeal(false);
        p.setNewRelease(false);
        profileOpt.ifPresent(p::setSellerProfile);

        productRepository.save(p);

        return ResponseEntity.ok(new CreateProductResponse(p.getId()));
    }

    @PutMapping("/products/{id}")
    @Transactional
    public ResponseEntity<?> updateProduct(@PathVariable String id, @RequestBody ProductDTO dto, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("Unauthenticated");

        Optional<Product> prodOpt = productRepository.findById(id);
        if (prodOpt.isEmpty()) return ResponseEntity.notFound().build();

        Product p = prodOpt.get();

        // Ownership check: seller can only edit own products
        if (user.getRole() == Role.MANAGER) {
            if (!Boolean.TRUE.equals(user.getSellerApproved())) {
                return ResponseEntity.status(403).body("Seller not approved");
            }
            if (p.getSellerProfile() == null || !p.getSellerProfile().getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Forbidden");
            }
        }

        // Apply updates
        p.setUrl(dto.getUrl());
        p.setResUrl(dto.getResUrl());
        p.setPrice(dto.getPrice());
        p.setValue(dto.getValue());
        p.setAccValue(dto.getAccValue());
        p.setDiscount(dto.getDiscount());
        p.setMrp(dto.getMrp());
        p.setName(dto.getName());
        p.setCategory(dto.getCategory());

        productRepository.save(p);
        return ResponseEntity.ok("Updated");
    }

        @org.springframework.beans.factory.annotation.Autowired
        private jakarta.persistence.EntityManager entityManager;

        @DeleteMapping("/products/{id}")
        @Transactional
        public ResponseEntity<?> deleteProduct(@PathVariable String id, HttpServletRequest request) {
            User user = (User) request.getAttribute("user");
            if (user == null) return ResponseEntity.status(401).body("Unauthenticated");
    
            Optional<Product> prodOpt = productRepository.findById(id);
            if (prodOpt.isEmpty()) return ResponseEntity.notFound().build();
    
            Product p = prodOpt.get();
    
            if (user.getRole() == Role.MANAGER) {
                if (!Boolean.TRUE.equals(user.getSellerApproved())) {
                    return ResponseEntity.status(403).body("Seller not approved");
                }
                if (p.getSellerProfile() == null || !p.getSellerProfile().getUser().getId().equals(user.getId())) {
                    return ResponseEntity.status(403).body("Forbidden");
                }
            }
    
            try {
                // Delete from CartItem first to prevent FK violation
                int delCart = entityManager.createQuery("DELETE FROM CartItem c WHERE c.product.id = :id")
                                           .setParameter("id", id).executeUpdate();
                System.out.println("DEBUG (Seller): deleted " + delCart + " cart items for product " + id);
                
                // Delete the Product
                int delProd = entityManager.createQuery("DELETE FROM Product p WHERE p.id = :id")
                                           .setParameter("id", id).executeUpdate();
                System.out.println("DEBUG (Seller): deleted " + delProd + " product with id " + id);
                
                return ResponseEntity.ok("Deleted");
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body("Error deleting product");
            }
        }

    @GetMapping("/me/products")
    public ResponseEntity<?> getMyProducts(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("Unauthenticated");

        Optional<SellerProfile> profileOpt = sellerProfileRepository.findByUserId(user.getId());
        if (profileOpt.isEmpty()) return ResponseEntity.ok(List.of());

        List<Product> products = productRepository.findAllBySellerProfileId(profileOpt.get().getId());
        return ResponseEntity.ok(products.stream().map(this::toDTO).collect(Collectors.toList()));
    }

    @GetMapping("/me/profile")
    public ResponseEntity<?> getMySellerProfile(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("Unauthenticated");

        return sellerProfileRepository.findByUserId(user.getId())
                .map(this::toSellerProfileDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(new SellerProfileDTO()));
    }

    @PostMapping("/me/profile")
    @Transactional
    public ResponseEntity<?> saveMySellerProfile(@RequestBody SellerProfileDTO dto, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("Unauthenticated");

        SellerProfile profile = sellerProfileRepository.findByUserId(user.getId()).orElseGet(() -> {
            SellerProfile p = new SellerProfile();
            p.setUser(user);
            p.setCreatedAt(LocalDateTime.now());
            p.setStatus("APPROVED");
            return p;
        });
        profile.setBusinessName(dto.getBusinessName());
        profile.setBio(dto.getBio());
        profile.setLogoUrl(dto.getLogoUrl());
        profile.setStatus(dto.getStatus() != null ? dto.getStatus() : profile.getStatus());
        sellerProfileRepository.save(profile);

        return ResponseEntity.ok(toSellerProfileDTO(profile));
    }

    @GetMapping("/me/orders")
    public ResponseEntity<?> getMySellerOrders(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("Unauthenticated");

        Optional<SellerProfile> profileOpt = sellerProfileRepository.findByUserId(user.getId());
        if (profileOpt.isEmpty()) return ResponseEntity.ok(List.of());

        List<Order> orders = orderRepository.findDistinctByOrderProductsProductSellerProfileIdOrderByDateOrderedDesc(profileOpt.get().getId());
        return ResponseEntity.ok(
                orders.stream().map(order -> {
                    List<OrderProduct> sellerItems = order.getOrderProducts().stream()
                            .filter(op -> op.getProduct() != null && op.getProduct().getSellerProfile() != null && op.getProduct().getSellerProfile().getId().equals(profileOpt.get().getId()))
                            .collect(Collectors.toList());
                    BigDecimal sellerTotal = sellerItems.stream()
                            .map(op -> op.getPriceAtTime().multiply(BigDecimal.valueOf(op.getQty())))
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return new OrderSummaryDTO(
                            order.getId(),
                            order.getUser() != null ? order.getUser().getId() : null,
                            order.getUser() != null ? order.getUser().getName() : null,
                            order.getDateOrdered(),
                            order.getIsPaid(),
                            sellerTotal,
                            sellerItems.stream().map(op -> new OrderItemDTO(op.getProduct().getId(), op.getProduct().getName(), op.getQty(), op.getPriceAtTime())).collect(Collectors.toList())
                    );
                }).collect(Collectors.toList())
        );
    }

    @GetMapping("/{sellerId}/products")
    public ResponseEntity<?> getProductsBySeller(@PathVariable String sellerId) {
        List<Product> products = productRepository.findAllBySellerProfileId(sellerId);
        return ResponseEntity.ok(products.stream().map(this::toDTO).collect(Collectors.toList()));
    }

    @GetMapping("/{sellerId}/profile")
    public ResponseEntity<?> getSellerPublicProfile(@PathVariable String sellerId) {
        return sellerProfileRepository.findById(sellerId)
                .map(this::toSellerProfileDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private ProductDTO toDTO(Product product) {
        List<String> points = product.getPoints() != null ? product.getPoints().stream().map(ProductPoint::getPoint).collect(Collectors.toList()) : List.of();
        String sellerId = product.getSellerProfile() != null ? product.getSellerProfile().getId() : null;
        String sellerName = product.getSellerProfile() != null && product.getSellerProfile().getUser() != null ? product.getSellerProfile().getUser().getName() : null;
        return new ProductDTO(product.getId(), product.getUrl(), product.getResUrl(), product.getPrice(), product.getValue(), product.getAccValue(), product.getDiscount(), product.getMrp(), product.getName(), product.getCategory(), points, sellerId, sellerName);
    }

    private SellerProfileDTO toSellerProfileDTO(SellerProfile profile) {
        return new SellerProfileDTO(profile.getId(), profile.getUser() != null ? profile.getUser().getId() : null, profile.getBusinessName(), profile.getBio(), profile.getLogoUrl(), profile.getStatus());
    }

    public static class OrderSummaryDTO {
        private String id;
        private String buyerId;
        private String buyerName;
        private java.time.LocalDateTime dateOrdered;
        private Boolean isPaid;
        private java.math.BigDecimal sellerTotal;
        private List<OrderItemDTO> items;

        public OrderSummaryDTO(String id, String buyerId, String buyerName, java.time.LocalDateTime dateOrdered, Boolean isPaid, java.math.BigDecimal sellerTotal, List<OrderItemDTO> items) {
            this.id = id;
            this.buyerId = buyerId;
            this.buyerName = buyerName;
            this.dateOrdered = dateOrdered;
            this.isPaid = isPaid;
            this.sellerTotal = sellerTotal;
            this.items = items;
        }

        public String getId() { return id; }
        public String getBuyerId() { return buyerId; }
        public String getBuyerName() { return buyerName; }
        public LocalDateTime getDateOrdered() { return dateOrdered; }
        public Boolean getIsPaid() { return isPaid; }
        public BigDecimal getSellerTotal() { return sellerTotal; }
        public List<OrderItemDTO> getItems() { return items; }
    }

    public static class OrderItemDTO {
        private String productId;
        private String productName;
        private Integer qty;
        private BigDecimal priceAtTime;

        public OrderItemDTO(String productId, String productName, Integer qty, BigDecimal priceAtTime) {
            this.productId = productId;
            this.productName = productName;
            this.qty = qty;
            this.priceAtTime = priceAtTime;
        }

        public String getProductId() { return productId; }
        public String getProductName() { return productName; }
        public Integer getQty() { return qty; }
        public BigDecimal getPriceAtTime() { return priceAtTime; }
    }

    public static class CreateProductResponse {
        private String productId;
        public CreateProductResponse(String productId) { this.productId = productId; }
        public String getProductId() { return productId; }
    }

    // Simple payload classes
    public static class SellerRequestBody {
        private String message;

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class CreateRequestResponse {
        private String requestId;

        public CreateRequestResponse(String requestId) { this.requestId = requestId; }
        public String getRequestId() { return requestId; }
    }

}
