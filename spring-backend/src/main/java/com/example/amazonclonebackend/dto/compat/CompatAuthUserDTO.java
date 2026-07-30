package com.example.amazonclonebackend.dto.compat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompatAuthUserDTO {
    private String _id;
    private String name;
    private String number;
    private String email;
    private List<CompatCartEntryDTO> cart;
    private List<CompatOrderWrapperDTO> orders;
    private String role;
    private Boolean sellerApproved;
    private String address;
    private Double lat;
    private Double lng;
}

