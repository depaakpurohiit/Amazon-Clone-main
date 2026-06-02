package com.example.amazonclonebackend;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import com.example.amazonclonebackend.entity.Role;
import com.example.amazonclonebackend.entity.User;
import com.example.amazonclonebackend.repository.UserRepository;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthFlowTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Test
    void registerLoginAndGetAuthUser_worksWithCookie() throws Exception {
        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Test User","number":"9999999999","email":"test@example.com","password":"pass123","confirmPassword":"pass123"}
                                """))
                .andExpect(status().isCreated());

        var loginResult = mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"test@example.com","password":"pass123"}
                                """))
                .andExpect(status().isCreated())
                .andReturn();

        String setCookie = loginResult.getResponse().getHeader(HttpHeaders.SET_COOKIE);
        assertThat(setCookie).isNotBlank();
        String cookiePair = setCookie.split(";", 2)[0]; // AmazonClone=...
        String token = cookiePair.substring(cookiePair.indexOf('=') + 1);

        mockMvc.perform(get("/api/getAuthUser")
                        .cookie(new Cookie("AmazonClone", token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._id").isNotEmpty())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.cart").isArray())
                .andExpect(jsonPath("$.orders").isArray());
    }

    @Test
    void sellerRegistration_persistsSellerRoleAndExposesItInAuthPayload() throws Exception {
        String email = "seller-flow@example.com";
        String number = "9988776655";

        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Seller User","number":"%s","email":"%s","password":"pass123","confirmPassword":"pass123","accountType":"seller","role":"SELLER"}
                                """.formatted(number, email)))
                .andExpect(status().isCreated());

        User saved = userRepository.findByEmail(email).orElseThrow();
        assertThat(saved.getRole()).isEqualTo(Role.SELLER);
        assertThat(saved.getSellerApproved()).isFalse();

        var loginResult = mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"%s","password":"pass123"}
                                """.formatted(email)))
                .andExpect(status().isCreated())
                .andReturn();

        String setCookie = loginResult.getResponse().getHeader(HttpHeaders.SET_COOKIE);
        assertThat(setCookie).isNotBlank();
        String cookiePair = setCookie.split(";", 2)[0];
        String token = cookiePair.substring(cookiePair.indexOf('=') + 1);

        mockMvc.perform(get("/api/getAuthUser")
                        .cookie(new Cookie("AmazonClone", token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("SELLER"))
                .andExpect(jsonPath("$.sellerApproved").value(false));
    }
}
