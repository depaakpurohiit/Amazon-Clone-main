package com.example.amazonclonebackend.dto.compat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompatOrderedProductDTO {
    private String id;
    private String name;
    private Integer qty;
    private String img;
}

