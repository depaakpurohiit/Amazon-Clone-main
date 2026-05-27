package com.example.amazonclonebackend.dto.compat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompatCartEntryDTO {
    private String id;
    private CompatProductDTO cartItem;
    private Integer qty;
}

