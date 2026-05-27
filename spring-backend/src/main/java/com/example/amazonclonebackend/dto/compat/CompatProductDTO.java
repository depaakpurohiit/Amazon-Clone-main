package com.example.amazonclonebackend.dto.compat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompatProductDTO {
    private String id;
    private String name;
    private String url;
    private Integer accValue;
}

