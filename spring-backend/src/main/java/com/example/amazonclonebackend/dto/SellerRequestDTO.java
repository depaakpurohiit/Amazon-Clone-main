package com.example.amazonclonebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerRequestDTO {
    private String id;
    private String requesterId;
    private String requesterName;
    private String requesterEmail;
    private String requesterNumber;
    private String message;
    private String status;
    private LocalDateTime createdAt;
}
