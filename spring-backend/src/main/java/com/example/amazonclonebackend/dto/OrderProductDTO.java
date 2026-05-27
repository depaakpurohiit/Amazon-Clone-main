package com.example.amazonclonebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderProductDTO {

    private String productId;
    private String productName;
    private Integer qty;
    private BigDecimal priceAtTime;

}