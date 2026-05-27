package com.example.amazonclonebackend.controller;

import com.example.amazonclonebackend.dto.OrderProductDTO;
import com.example.amazonclonebackend.dto.compat.CompatCreateOrderRequest;
import com.example.amazonclonebackend.dto.compat.CompatPayOrderRequest;
import com.example.amazonclonebackend.entity.Order;
import com.example.amazonclonebackend.entity.User;
import com.example.amazonclonebackend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PaymentController {

    private static final DateTimeFormatter LEGACY_DATE = DateTimeFormatter.ofPattern("d/M/yyyy");

    private final OrderService orderService;

    @Value("${razorpay.key-id:rzp_test_mock_key}")
    private String razorpayKeyId;

    @GetMapping("/get-razorpay-key")
    public ResponseEntity<Map<String, String>> getRazorpayKey() {
        Map<String, String> response = new HashMap<>();
        response.put("key", razorpayKeyId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody CompatCreateOrderRequest request,
                                                         @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("status", false, "message", "Not authenticated"));
        }

        BigDecimal amount;
        try {
            amount = new BigDecimal(request.getAmount());
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("status", false, "message", "Invalid amount"));
        }

        // For development, return mock order if Razorpay not configured
        if ("your_razorpay_key_id_here".equals(razorpayKeyId) || "rzp_test_mock_key".equals(razorpayKeyId)) {
            Map<String, Object> mockOrder = new HashMap<>();
            mockOrder.put("id", "order_mock_" + System.currentTimeMillis());
            mockOrder.put("amount", amount);
            mockOrder.put("currency", "INR");

            Map<String, Object> response = new HashMap<>();
            response.put("order", mockOrder);
            return ResponseEntity.ok(response);
        }

        // TODO: Integrate with actual Razorpay SDK
        // For now, return mock response
        Map<String, Object> mockOrder = new HashMap<>();
        mockOrder.put("id", "order_razorpay_" + System.currentTimeMillis());
        mockOrder.put("amount", amount);
        mockOrder.put("currency", "INR");

        Map<String, Object> response = new HashMap<>();
        response.put("order", mockOrder);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/pay-order")
    public ResponseEntity<Map<String, Object>> payOrder(@RequestBody CompatPayOrderRequest request,
                                                       @AuthenticationPrincipal User user) {

        try {
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("status", false, "message", "Not authenticated"));
            }

            BigDecimal amount;
            try {
                amount = new BigDecimal(request.getAmount());
            } catch (Exception e) {
                return ResponseEntity.status(400).body(Map.of("status", false, "message", "Invalid amount"));
            }

            List<OrderProductDTO> orderedProducts = orderService.normalizeLegacyOrderedProducts(request.getOrderedProducts(), amount);

            LocalDateTime dateOrdered = parseLegacyDate(request.getDateOrdered());

            Order order = orderService.createOrder(user, orderedProducts, amount, dateOrdered,
                    request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Payment was successful");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("status", false, "message", e.getMessage()));
        }
    }

    private LocalDateTime parseLegacyDate(String dateOrdered) {
        if (dateOrdered == null || dateOrdered.isBlank()) {
            return LocalDateTime.now();
        }
        try {
            LocalDate d = LocalDate.parse(dateOrdered, LEGACY_DATE);
            return d.atStartOfDay();
        } catch (Exception e) {
            return LocalDateTime.now();
        }
    }

}
