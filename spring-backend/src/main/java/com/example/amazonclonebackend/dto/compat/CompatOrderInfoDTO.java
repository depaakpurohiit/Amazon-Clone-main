package com.example.amazonclonebackend.dto.compat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompatOrderInfoDTO {
    private List<CompatOrderedProductDTO> products;
    private String date;
    private Boolean isPaid;
    private String amount;
    private CompatRazorpayDTO razorpay;
}

