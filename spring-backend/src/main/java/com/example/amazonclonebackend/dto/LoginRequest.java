package com.example.amazonclonebackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Email can't be empty")
    @Email(message = "Email format invalid")
    private String email;

    @NotBlank(message = "Password can't be empty")
    private String password;

}
