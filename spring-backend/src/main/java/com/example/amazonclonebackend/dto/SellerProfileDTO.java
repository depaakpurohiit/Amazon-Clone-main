package com.example.amazonclonebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerProfileDTO {
    private String id;
    private String userId;
    private String businessName;
    private String bio;
    private String logoUrl;
    private String status;
}
