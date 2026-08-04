package com.example.amazonclonebackend.service;

import com.example.amazonclonebackend.dto.OrderDTO;
import com.example.amazonclonebackend.dto.OrderProductDTO;
import com.example.amazonclonebackend.entity.*;
import com.example.amazonclonebackend.repository.OrderRepository;
import com.example.amazonclonebackend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;

    public List<OrderProductDTO> normalizeLegacyOrderedProducts(Object orderedProducts, BigDecimal amount) {
        if (orderedProducts == null) {
            throw new RuntimeException("orderedProducts is required");
        }

        if (orderedProducts instanceof List<?> list) {
            return list.stream()
                    .map(item -> {
                        if (!(item instanceof Map<?, ?> map)) {
                            throw new RuntimeException("Invalid orderedProducts item");
                        }
                        return legacyMapToOrderProductDTO((Map<?, ?>) map);
                    })
                    .collect(Collectors.toList());
        }

        if (orderedProducts instanceof Map<?, ?> map) {
            return List.of(legacyMapToOrderProductDTO(map));
        }

        throw new RuntimeException("Invalid orderedProducts");
    }

    private OrderProductDTO legacyMapToOrderProductDTO(Map<?, ?> map) {
        Object idObj = map.get("id");
        if (idObj == null) {
            // fallback to productId if caller sends DTO-like shape
            idObj = map.get("productId");
        }
        String productId = idObj != null ? String.valueOf(idObj) : null;
        if (productId == null || productId.isBlank()) {
            throw new RuntimeException("Product id missing in orderedProducts");
        }

        Integer qty = 1;
        Object qtyObj = map.get("qty");
        if (qtyObj instanceof Number n) {
            qty = n.intValue();
        } else if (qtyObj != null) {
            qty = Integer.parseInt(String.valueOf(qtyObj));
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        return new OrderProductDTO(
                product.getId(),
                product.getName(),
                qty,
                parseAccValue(product.getAccValue())
        );
    }

    private BigDecimal parseAccValue(String accValue) {
        if (accValue == null || accValue.trim().equals("-") || accValue.trim().isEmpty()) {
            return BigDecimal.ZERO;
        }
        try {
            return new BigDecimal(accValue.trim());
        } catch (NumberFormatException e) {
            return BigDecimal.ZERO;
        }
    }

    @Transactional
    public Order createOrder(User user, List<OrderProductDTO> orderedProducts, BigDecimal amount,
                           String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        return createOrder(user, orderedProducts, amount, LocalDateTime.now(), razorpayOrderId, razorpayPaymentId, razorpaySignature);
    }

    @Transactional
    public Order createOrder(User user, List<OrderProductDTO> orderedProducts, BigDecimal amount, LocalDateTime dateOrdered,
                             String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        Order order = new Order();
        order.setUser(user);
        order.setDateOrdered(dateOrdered != null ? dateOrdered : LocalDateTime.now());
        order.setIsPaid(true);
        order.setAmount(amount);
        order.setRazorpayOrderId(razorpayOrderId);
        order.setRazorpayPaymentId(razorpayPaymentId);
        order.setRazorpaySignature(razorpaySignature);

        // Create order products
        List<OrderProduct> orderProducts = orderedProducts.stream()
                .map(dto -> {
                    Optional<Product> productOpt = productRepository.findById(dto.getProductId());
                    if (productOpt.isEmpty()) {
                        throw new RuntimeException("Product not found: " + dto.getProductId());
                    }

                    OrderProduct orderProduct = new OrderProduct();
                    orderProduct.setOrder(order);
                    orderProduct.setProduct(productOpt.get());
                    orderProduct.setQty(dto.getQty());
                    orderProduct.setPriceAtTime(dto.getPriceAtTime());
                    return orderProduct;
                })
                .collect(Collectors.toList());

        order.setOrderProducts(orderProducts);

        // Clear user's cart
        cartService.clearCart(user);

        return orderRepository.save(order);
    }

    public List<OrderDTO> getOrdersForUser(User user) {
        return orderRepository.findByUserOrderByDateOrderedDesc(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private OrderDTO convertToDTO(Order order) {
        List<OrderProductDTO> products = order.getOrderProducts().stream()
                .map(op -> new OrderProductDTO(
                        op.getProduct().getId(),
                        op.getProduct().getName(),
                        op.getQty(),
                        op.getPriceAtTime()
                ))
                .collect(Collectors.toList());

        return new OrderDTO(
                order.getId(),
                order.getDateOrdered(),
                order.getIsPaid(),
                order.getAmount(),
                order.getRazorpayOrderId(),
                order.getRazorpayPaymentId(),
                order.getRazorpaySignature(),
                products
        );
    }

}
