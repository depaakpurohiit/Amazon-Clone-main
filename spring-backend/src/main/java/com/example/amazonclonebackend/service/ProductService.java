package com.example.amazonclonebackend.service;

import com.example.amazonclonebackend.dto.ProductDTO;
import com.example.amazonclonebackend.entity.Product;
import com.example.amazonclonebackend.entity.ProductPoint;
import com.example.amazonclonebackend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductDTO> getAllProducts() {
        return getProducts(null, null);
    }

    public Optional<ProductDTO> getProductById(String id) {
        return productRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<ProductDTO> getProducts(String category, String tag) {
        List<Product> all = productRepository.findAll();

        List<Product> filtered = all.stream()
                .filter(p -> matchesCategory(p, category))
                .filter(p -> matchesTag(p, tag))
                .sorted(Comparator.comparingInt(ProductService::sortKey))
                .toList();

        // Defensive de-duplication: some databases may already contain duplicate rows
        // (e.g. from earlier seeding with generated UUID ids). Frontend sliders rely on
        // stable ordering/slicing, so duplicates are very visible.
        return dedupeByKey(filtered, Product::getUrl).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ProductDTO convertToDTO(Product product) {
        List<String> points = product.getPoints() != null ?
                product.getPoints().stream()
                        .map(ProductPoint::getPoint)
                        .collect(Collectors.toList()) :
                List.of();

        String sellerId = null;
        String sellerName = null;
        if (product.getSellerProfile() != null && product.getSellerProfile().getUser() != null) {
            sellerId = product.getSellerProfile().getId();
            sellerName = product.getSellerProfile().getUser().getName();
        }

        return new ProductDTO(
            product.getId(),
            product.getUrl(),
            product.getResUrl(),
            product.getPrice(),
            product.getValue(),
            product.getAccValue(),
            product.getDiscount(),
            product.getMrp(),
            product.getName(),
            product.getCategory(),
            points,
            sellerId,
            sellerName
        );
    }

    private static <T, K> List<T> dedupeByKey(List<T> items, Function<T, K> keyFn) {
        LinkedHashMap<K, T> map = new LinkedHashMap<>();
        for (T item : items) {
            if (item == null) continue;
            K key = keyFn.apply(item);
            if (key == null) continue;
            map.putIfAbsent(key, item);
        }
        return List.copyOf(map.values());
    }

    private static boolean matchesCategory(Product product, String category) {
        if (category == null || category.isBlank() || "all".equalsIgnoreCase(category)) return true;
        if (product == null) return false;
        if (product.getCategory() == null) return false;

        Set<String> wanted = Arrays.stream(category.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toUpperCase)
                .collect(Collectors.toSet());

        return wanted.contains(product.getCategory().toUpperCase());
    }

    private static boolean matchesTag(Product product, String tag) {
        if (tag == null || tag.isBlank()) return true;
        if (product == null) return false;
        String t = tag.trim().toLowerCase();
        return switch (t) {
            case "best-sellers", "bestsellers", "best" -> product.isBestSeller();
            case "todays-deals", "today-deals", "deals", "deal" -> product.isTodayDeal();
            case "new-releases", "new", "newrelease" -> product.isNewRelease();
            default -> true;
        };
    }

    private static int sortKey(Product p) {
        if (p == null || p.getId() == null) return Integer.MAX_VALUE;
        try {
            return Integer.parseInt(p.getId());
        } catch (NumberFormatException ignored) {
            return Integer.MAX_VALUE;
        }
    }

}
