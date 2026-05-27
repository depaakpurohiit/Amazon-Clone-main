package com.example.amazonclonebackend.security;

import com.example.amazonclonebackend.entity.User;
import com.example.amazonclonebackend.entity.UserToken;
import com.example.amazonclonebackend.repository.UserRepository;
import com.example.amazonclonebackend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = getTokenFromCookie(request);

        if (token != null && jwtService.validateToken(token)) {
            String userId = jwtService.getUserIdFromToken(token);

            // Verify token exists in database
            Optional<UserToken> userTokenOpt = jwtService.findByToken(token);
            if (userTokenOpt.isPresent()) {
                // Load a fully initialized User entity (avoid lazy proxy issues outside a session)
                Optional<User> userOpt = userRepository.findById(userId);
                if (userOpt.isEmpty()) {
                    filterChain.doFilter(request, response);
                    return;
                }
                User user = userOpt.get();

                // Set user in request attributes for controllers
                request.setAttribute("user", user);

                // Set authentication in security context
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("AmazonClone".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

}
