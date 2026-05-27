package com.example.amazonclonebackend.service;

import com.example.amazonclonebackend.dto.compat.*;
import com.example.amazonclonebackend.entity.CartItem;
import com.example.amazonclonebackend.entity.Order;
import com.example.amazonclonebackend.entity.OrderProduct;
import com.example.amazonclonebackend.entity.Product;
import com.example.amazonclonebackend.entity.User;
import com.example.amazonclonebackend.repository.CartItemRepository;
import com.example.amazonclonebackend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompatAuthUserService {

    private static final DateTimeFormatter LEGACY_DATE = DateTimeFormatter.ofPattern("d/M/yyyy");

    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;

    public CompatAuthUserDTO build(User user) {
        List<CompatCartEntryDTO> cart = cartItemRepository.findByUser(user).stream()
                .map(this::toCompatCart)
                .collect(Collectors.toList());

        List<CompatOrderWrapperDTO> orders = orderRepository.findByUserOrderByDateOrderedDesc(user).stream()
                .map(this::toCompatOrderWrapper)
                .collect(Collectors.toList());

        return new CompatAuthUserDTO(
                user.getId(),
                user.getName(),
                user.getNumber(),
                user.getEmail(),
                cart,
                orders
        );
    }

    private CompatCartEntryDTO toCompatCart(CartItem cartItem) {
        Product product = cartItem.getProduct();
        CompatProductDTO productDTO = new CompatProductDTO(
                product.getId(),
                product.getName(),
                product.getUrl(),
                product.getAccValue()
        );

        return new CompatCartEntryDTO(
                product.getId(),
                productDTO,
                cartItem.getQty()
        );
    }

    private CompatOrderWrapperDTO toCompatOrderWrapper(Order order) {
        List<CompatOrderedProductDTO> products = order.getOrderProducts().stream()
                .map(this::toCompatOrderedProduct)
                .collect(Collectors.toList());

        String date = order.getDateOrdered() != null ? order.getDateOrdered().format(LEGACY_DATE) : null;
        String amount = order.getAmount() != null ? order.getAmount().toPlainString() : null;

        CompatOrderInfoDTO orderInfo = new CompatOrderInfoDTO(
                products,
                date,
                order.getIsPaid(),
                amount,
                new CompatRazorpayDTO(
                        order.getRazorpayOrderId(),
                        order.getRazorpayPaymentId(),
                        order.getRazorpaySignature()
                )
        );

        return new CompatOrderWrapperDTO(orderInfo);
    }

    private CompatOrderedProductDTO toCompatOrderedProduct(OrderProduct op) {
        Product product = op.getProduct();
        return new CompatOrderedProductDTO(
                product.getId(),
                product.getName(),
                op.getQty(),
                product.getUrl()
        );
    }
}

