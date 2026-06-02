package com.example.amazonclonebackend.repository;

import com.example.amazonclonebackend.entity.Order;
import com.example.amazonclonebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    List<Order> findByUserOrderByDateOrderedDesc(User user);

    List<Order> findDistinctByOrderProductsProductSellerProfileIdOrderByDateOrderedDesc(String sellerProfileId);

}