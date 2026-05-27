package com.example.amazonclonebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private String id;
    private String name;
    private String number;
    private String email;
    private LocalDateTime createdAt;
    private List<CartItemDTO> cart;
    private List<OrderDTO> orders;

}