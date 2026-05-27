package com.example.amazonclonebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private String id;
    private String url;
    private String resUrl;
    private String price;
    private String value;
    private Integer accValue;
    private String discount;
    private String mrp;
    private String name;
    private String category;
    private List<String> points;

}
