package com.example.amazonclonebackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    private String id;

    @Column(nullable = false)
    private String url;

    @Column(name = "res_url")
    private String resUrl;

    @Column(nullable = false)
    private String price;

    @Column(nullable = false)
    private String value;

    @Column(name = "acc_value", nullable = false)
    private String accValue;

    private String discount;

    private String mrp;

    @Column(nullable = false)
    private String name;

    @Column
    private String category;

    @Column(name = "best_seller", nullable = false)
    private boolean bestSeller;

    @Column(name = "today_deal", nullable = false)
    private boolean todayDeal;

    @Column(name = "new_release", nullable = false)
    private boolean newRelease;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductPoint> points;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_profile_id")
    private SellerProfile sellerProfile;

}
