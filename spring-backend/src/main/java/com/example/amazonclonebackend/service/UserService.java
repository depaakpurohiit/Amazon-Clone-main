package com.example.amazonclonebackend.service;

import com.example.amazonclonebackend.dto.RegisterRequest;
import com.example.amazonclonebackend.dto.UserDTO;
import com.example.amazonclonebackend.entity.User;
import com.example.amazonclonebackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Lazy
    @Autowired
    private CartService cartService;

    @Lazy
    @Autowired
    private OrderService orderService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.existsByNumber(request.getNumber())) {
            throw new RuntimeException("Number already registered");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords don't match");
        }

        User user = new User();
        user.setName(request.getName());
        user.setNumber(request.getNumber());
        user.setEmail(request.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase());
    }

    public Optional<UserDTO> getUserDTOById(String id) {
        return userRepository.findById(id)
                .map(this::convertToDTO);
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getNumber(),
                user.getEmail(),
                user.getCreatedAt(),
                cartService.getCartItemsForUser(user),
                orderService.getOrdersForUser(user)
        );
    }

}
