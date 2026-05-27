package com.example.amazonclonebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {

    private String id;
    private LocalDateTime dateOrdered;
    private Boolean isPaid;
    private BigDecimal amount;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private List<OrderProductDTO> products;

}