package com.example.amazonclonebackend.dto.compat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompatRazorpayDTO {
    private String orderId;
    private String paymentId;
    private String signature;
}

