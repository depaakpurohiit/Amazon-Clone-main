package com.example.amazonclonebackend.migration;

import com.example.amazonclonebackend.entity.CartItem;
import com.example.amazonclonebackend.entity.Product;
import com.example.amazonclonebackend.entity.User;
import com.example.amazonclonebackend.entity.UserToken;
import com.example.amazonclonebackend.repository.CartItemRepository;
import com.example.amazonclonebackend.repository.ProductRepository;
import com.example.amazonclonebackend.repository.UserRepository;
import com.example.amazonclonebackend.repository.UserTokenRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
@ConditionalOnProperty(prefix = "app.import", name = "fallback-users", havingValue = "true")
public class FallbackUsersImporter implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(FallbackUsersImporter.class);

    private final UserRepository userRepository;
    private final UserTokenRepository userTokenRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final ObjectMapper objectMapper;
    private final String fallbackPath;

    public FallbackUsersImporter(UserRepository userRepository,
                                 UserTokenRepository userTokenRepository,
                                 ProductRepository productRepository,
                                 CartItemRepository cartItemRepository,
                                 ObjectMapper objectMapper,
                                 @Value("${app.import.fallback-users.path:../fallback_users.json}") String fallbackPath) {
        this.userRepository = userRepository;
        this.userTokenRepository = userTokenRepository;
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
        this.objectMapper = objectMapper;
        this.fallbackPath = fallbackPath;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        Path path = Paths.get(fallbackPath);
        if (!Files.exists(path)) {
            log.warn("Fallback users file not found at {} - skipping import", path.toAbsolutePath());
            return;
        }
        log.info("Importing fallback users from {}", path.toAbsolutePath());
        String content = Files.readString(path);
        List<Map<String, Object>> list = objectMapper.readValue(content, new TypeReference<List<Map<String, Object>>>() {
        });
        for (Map<String, Object> item : list) {
            String externalId = (String) item.get("_id");
            String name = (String) item.get("name");
            String number = (String) item.get("number");
            String email = (String) item.get("email");
            String password = (String) item.get("password");
            String createdAtStr = (String) item.get("createdAt");
            LocalDateTime createdAt = null;
            try {
                if (createdAtStr != null) {
                    Instant inst = Instant.parse(createdAtStr);
                    createdAt = LocalDateTime.ofInstant(inst, ZoneOffset.UTC);
                }
            } catch (Exception e) {
                log.warn("Failed to parse createdAt {} for user {}", createdAtStr, email);
            }

            if (email == null) {
                log.warn("Skipping user with missing email: {}", externalId);
                continue;
            }
            if (userRepository.existsByEmail(email)) {
                log.info("User with email {} already exists - skipping", email);
                continue;
            }

            User user = new User();
            if (externalId != null && !externalId.isBlank()) {
                user.setId(externalId);
            }
            user.setName(name == null ? "Imported User" : name);
            user.setEmail(email);
            user.setNumber(number == null ? "" : number);
            user.setPassword(password == null ? "" : password);
            if (createdAt != null) user.setCreatedAt(createdAt);

            user = userRepository.save(user);
            log.info("Imported user {} (id={})", email, user.getId());

            Object tokensObj = item.get("tokens");
            if (tokensObj instanceof List) {
                List<?> tokens = (List<?>) tokensObj;
                for (Object t : tokens) {
                    if (t instanceof Map) {
                        Object tokenVal = ((Map<?, ?>) t).get("token");
                        if (tokenVal instanceof String) {
                            UserToken ut = new UserToken();
                            ut.setUser(user);
                            ut.setToken((String) tokenVal);
                            userTokenRepository.save(ut);
                        }
                    }
                }
            }

            Object cartObj = item.get("cart");
            if (cartObj instanceof List) {
                List<?> cart = (List<?>) cartObj;
                for (Object cObj : cart) {
                    if (cObj instanceof Map) {
                        Map<?, ?> cMap = (Map<?, ?>) cObj;
                        Object cartItemObj = cMap.get("cartItem");
                        Integer qty = null;
                        Object qtyObj = cMap.get("qty");
                        if (qtyObj instanceof Number) qty = ((Number) qtyObj).intValue();
                        else if (qtyObj instanceof String) {
                            try {
                                qty = Integer.parseInt((String) qtyObj);
                            } catch (Exception ex) {
                            }
                        }
                        String productName = null;
                        if (cartItemObj instanceof Map) {
                            Object pn = ((Map<?, ?>) cartItemObj).get("name");
                            if (pn instanceof String) productName = (String) pn;
                        }
                        if (productName == null) {
                            log.warn("Cart item for user {} missing product name - skipping", email);
                            continue;
                        }
                        Optional<Product> prodOpt = productRepository.findByName(productName);
                        if (prodOpt.isEmpty()) {
                            log.warn("Could not find product with name '{}' to add to cart for user {}", productName, email);
                            continue;
                        }
                        Product product = prodOpt.get();
                        CartItem cartItem = new CartItem();
                        cartItem.setUser(user);
                        cartItem.setProduct(product);
                        cartItem.setQty(qty == null || qty < 1 ? 1 : qty);
                        cartItemRepository.save(cartItem);
                        log.info("Added cart item for user {} -> product {} qty {}", email, product.getId(), cartItem.getQty());
                    }
                }
            }
        }
        log.info("Fallback users import completed.");
    }
}
