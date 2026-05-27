package com.example.amazonclonebackend.dto.compat;

import lombok.Data;

import java.util.List;

@Data
public class CompatPayOrderRequest {
    private Object orderedProducts;
    private String dateOrdered;
    private String amount;
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;

    @Data
    public static class OrderedProduct {
        private String id;
        private String name;
        private Integer qty;
        private String img;
    }
}

