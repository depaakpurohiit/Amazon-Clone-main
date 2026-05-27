package com.example.amazonclonebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {

    private String productId;
    private String productName;
    private String productUrl;
    private String productPrice;
    private Integer qty;

}