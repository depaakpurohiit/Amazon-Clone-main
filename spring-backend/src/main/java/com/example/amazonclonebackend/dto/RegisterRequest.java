package com.example.amazonclonebackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Name can't be empty")
    private String name;

    @NotBlank(message = "Number can't be empty")
    @Pattern(regexp = "^\\d{10}$", message = "Number must consist of 10 digits")
    private String number;

    @NotBlank(message = "Email can't be empty")
    @Email(message = "Email format is invalid")
    private String email;

    @NotBlank(message = "Password can't be empty")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotBlank(message = "Confirm Password can't be empty")
    private String confirmPassword;

    /**
     * Optional account type coming from the frontend signup flow.
     * Accepted values: customer, seller.
     */
    private String accountType;

    /**
     * Optional explicit role field for compatibility with older/newer clients.
     * Accepted values: USER, SELLER.
     */
    private String role;

}
