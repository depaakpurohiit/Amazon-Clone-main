package com.example.amazonclonebackend.config;

import com.example.amazonclonebackend.entity.Product;
import com.example.amazonclonebackend.entity.ProductPoint;
import com.example.amazonclonebackend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@Order(Ordered.LOWEST_PRECEDENCE)
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final ProductRepository productRepository;

        /**
         * Seeding modes:
         * - none: do not seed
         * - empty-only: seed only when products table is empty
         * - missing: insert only products that don't exist by id (safe to re-run)
         * - replace: clear products table and insert only the seed list (used to enforce a fixed test dataset)
         */
        @Value("${app.seed.products:none}")
        private String seedMode;

    @Override
    public void run(String... args) {
        String mode = seedMode == null ? "none" : seedMode.trim().toLowerCase(Locale.ROOT);
        if ("none".equals(mode)) return;

        if ("empty-only".equals(mode)) {
            if (productRepository.count() == 0) {
                seedProductsMissingOnly(getSeedProducts());
            }
            return;
        }

                // support explicit replace mode to enforce a fixed dataset
                if ("replace".equals(mode)) {
                        seedReplaceAll(getSeedProducts());
                        return;
                }

                // default: missing
                seedProductsMissingOnly(getSeedProducts());
    }

        private void seedReplaceAll(List<Product> seed) {
                productRepository.deleteAll();
                if (!seed.isEmpty()) {
                        productRepository.saveAll(seed);
                        System.out.println("Replaced products table with " + seed.size() + " product(s).");
                } else {
                        System.out.println("Replace seed list is empty; products table cleared.");
                }
        }

    private void seedProductsMissingOnly(List<Product> seed) {
        Set<String> seedIds = seed.stream()
                .filter(Objects::nonNull)
                .map(Product::getId)
                .filter(Objects::nonNull)
                .filter(id -> !id.isBlank())
                .collect(Collectors.toSet());

        Map<String, Product> existingById = productRepository.findAllById(seedIds).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        List<Product> toInsert = seed.stream()
                .filter(Objects::nonNull)
                .filter(p -> p.getId() != null && !p.getId().isBlank())
                .filter(p -> !existingById.containsKey(p.getId()))
                .collect(Collectors.toList());

        List<Product> toUpdate = seed.stream()
                .filter(Objects::nonNull)
                .filter(p -> p.getId() != null && !p.getId().isBlank())
                .filter(p -> existingById.containsKey(p.getId()))
                .map(seedProduct -> {
                    Product existing = existingById.get(seedProduct.getId());
                    boolean changed = false;

                    if (!Objects.equals(existing.getUrl(), seedProduct.getUrl())) {
                        existing.setUrl(seedProduct.getUrl());
                        changed = true;
                    }
                    if (!Objects.equals(existing.getResUrl(), seedProduct.getResUrl())) {
                        existing.setResUrl(seedProduct.getResUrl());
                        changed = true;
                    }

                    return changed ? existing : null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        if (toInsert.isEmpty() && toUpdate.isEmpty()) {
            System.out.println("Product seeding skipped (no missing or updated seed products).");
            return;
        }

        if (!toInsert.isEmpty()) {
            productRepository.saveAll(toInsert);
            System.out.println("Seeded " + toInsert.size() + " new product(s) into database.");
        }

        if (!toUpdate.isEmpty()) {
            productRepository.saveAll(toUpdate);
            System.out.println("Updated " + toUpdate.size() + " existing product(s) in database.");
        }
    }

    private List<Product> getSeedProducts() {
        return Arrays.asList(
                // Only 30 products with local image paths
                createProduct("1", "/images/products/1.jpg", "/images/products/1.jpg",
                        "₹61,990.00", "61,990", 61990, "-46%", "₹1,15,668.00",
                        "Lenovo ThinkBook 14 Intel Core i5 11th Gen 14 inch (35.56cm) FHD IPS Thin & Light Laptop (16GB RAM/512GB SSD/Windows 11 Home/MS Office 2021/FPR/Intel Iris Xe Graphics Mineral Grey/1.4 kg), 20VDA0TLIH",
                        "ELECTRONICS", true, true, false,
                        Arrays.asList(
                                "Processor: 11th Gen Intel Core i5 | 16GB RAM | 512GB SSD",
                                "14-inch FHD IPS display | Integrated Iris Xe graphics",
                                "Windows 11 Home | MS Office Home & Student 2021",
                                "USB-C + Thunderbolt 4 | HDMI | Ethernet",
                                "MIL-STD durability tested"
                        )),
                createProduct("2", "/images/products/2.jpg", "/images/products/2.jpg",
                        "₹39,499.00", "39,499", 39499, "-47%", "₹74,999.00",
                        "Samsung Galaxy S20 FE 5G (Cloud Navy, 8GB RAM, 128GB Storage)",
                        "MOBILES", true, true, false,
                        Arrays.asList(
                                "Snapdragon 865 | 8GB RAM | 128GB storage (expandable)",
                                "6.5-inch Super AMOLED | 120Hz refresh rate",
                                "Triple rear camera + 32MP front camera",
                                "4500mAh battery | Fast + wireless charging",
                                "IP68 rated"
                        )),
                createProduct("3", "/images/products/3.jpg", "/images/products/3.jpg",
                        "₹21,900.00", "21,900", 21900, "-12%", "₹24,900.00",
                        "Apple AirPods Pro with MagSafe Charging Case",
                        "ACCESSORIES", true, true, false,
                        Arrays.asList(
                                "Active Noise Cancellation",
                                "Transparency mode",
                                "Adaptive EQ",
                                "Sweat and water resistant"
                        )),
                createProduct("4", "/images/products/4.jpg", "/images/products/4.jpg",
                        "₹9,999.00", "9,999", 9999, "-23%", "₹12,999.00",
                        "Noise Cancelling Wireless Headphones (Bluetooth, 40h Playtime)",
                        "ELECTRONICS", false, true, false,
                        Arrays.asList(
                                "Active noise cancellation",
                                "40-hour battery | USB-C fast charging",
                                "Built-in mic for calls"
                        )),
                createProduct("5", "/images/products/5.jpg", "/images/products/5.jpg",
                        "₹1,299.00", "1,299", 1299, "-35%", "₹1,999.00",
                        "Fast Charging Power Bank 10000mAh (USB-C + USB-A)",
                        "ACCESSORIES", true, true, false,
                        Arrays.asList(
                                "10000mAh capacity",
                                "Dual output ports",
                                "Multi-layer protection"
                        )),
                createProduct("6", "/images/products/6.jpg", "/images/products/6.jpg",
                        "₹2,499.00", "2,499", 2499, "-28%", "₹3,499.00",
                        "Smart Fitness Band with Heart Rate & SpO2 Monitor",
                        "ACCESSORIES", false, true, false,
                        Arrays.asList(
                                "24/7 heart rate tracking | SpO2 monitoring",
                                "Sleep tracking | Multiple sports modes",
                                "Water resistant"
                        )),
                createProduct("7", "/images/products/7.jpg", "/images/products/7.jpg",
                        "₹54,990.00", "54,990", 54990, "-18%", "₹66,990.00",
                        "Gaming Laptop (Ryzen 7, 16GB RAM, 512GB SSD, RTX Graphics)",
                        "ELECTRONICS", true, false, true,
                        Arrays.asList(
                                "Ryzen 7 processor",
                                "16GB RAM | 512GB SSD",
                                "Dedicated RTX graphics"
                        )),
                createProduct("8", "/images/products/8.jpg", "/images/products/8.jpg",
                        "₹799.00", "799", 799, "-38%", "₹1,299.00",
                        "Stainless Steel Water Bottle (1 Litre, Insulated)",
                        "HOME", false, true, false,
                        Arrays.asList(
                                "Double-wall insulation",
                                "Leak-proof lid | BPA-free",
                                "Easy to clean"
                        )),
                createProduct("9", "/images/products/9.jpg", "/images/products/9.jpg",
                        "₹3,999.00", "3,999", 3999, "-20%", "₹4,999.00",
                        "Wireless Mechanical Keyboard (RGB, Hot-swappable)",
                        "ELECTRONICS", false, true, false,
                        Arrays.asList(
                                "Wireless + wired modes",
                                "Hot-swappable switches",
                                "Per-key RGB"
                        )),
                createProduct("10", "/images/products/10.jpg", "/images/products/10.jpg",
                        "₹1,499.00", "1,499", 1499, "-40%", "₹2,499.00",
                        "Ergonomic Wireless Mouse (Rechargeable, Silent Click)",
                        "ELECTRONICS", false, true, false,
                        Arrays.asList(
                                "Ergonomic shape",
                                "USB-C rechargeable",
                                "Adjustable DPI"
                        )),
                createProduct("11", "/images/products/11.jpg", "/images/products/11.jpg",
                        "₹24,990.00", "24,990", 24990, "-17%", "₹29,990.00",
                        "Android Tablet 10.4\" (6GB RAM, 128GB Storage)",
                        "ELECTRONICS", true, false, true,
                        Arrays.asList(
                                "10.4-inch display",
                                "128GB storage (expandable)",
                                "Dual speakers"
                        )),
                createProduct("12", "/images/products/12.jpg", "/images/products/12.jpg",
                        "₹6,499.00", "6,499", 6499, "-24%", "₹8,499.00",
                        "Smart Speaker with Voice Assistant (Wi‑Fi, Bluetooth)",
                        "HOME", false, true, false,
                        Arrays.asList(
                                "Hands-free voice control",
                                "Multi-room audio",
                                "Clear vocals and bass"
                        )),
                createProduct("13", "/images/products/13.jpg", "/images/products/13.jpg",
                        "₹1,999.00", "1,999", 1999, "-33%", "₹2,999.00",
                        "Portable SSD 500GB (USB 3.2, Shock Resistant)",
                        "ACCESSORIES", false, true, true,
                        Arrays.asList(
                                "Fast USB 3.2 transfers",
                                "Shock resistant",
                                "Compact design"
                        )),
                createProduct("14", "/images/products/14.jpg", "/images/products/14.jpg",
                        "₹12,990.00", "12,990", 12990, "-22%", "₹16,990.00",
                        "Air Fryer 4L (Digital, Multiple Presets)",
                        "HOME", true, false, true,
                        Arrays.asList(
                                "Less oil cooking",
                                "Digital presets",
                                "Easy-clean basket"
                        )),
                createProduct("15", "/images/products/15.jpg", "/images/products/15.jpg",
                        "₹999.00", "999", 999, "-50%", "₹1,999.00",
                        "Non-stick Cookware Set (PFOA Free, Induction Base)",
                        "HOME", false, true, false,
                        Arrays.asList(
                                "Induction compatible",
                                "Non-stick coating",
                                "Heat-resistant handles"
                        )),
                createProduct("16", "/images/products/16.jpg", "/images/products/16.jpg",
                        "₹2,799.00", "2,799", 2799, "-30%", "₹3,999.00",
                        "Men's Running Shoes (Lightweight, Breathable)",
                        "SHOES", true, false, false,
                        Arrays.asList(
                                "Breathable mesh",
                                "Cushioned sole",
                                "Durable outsole"
                        )),
                createProduct("17", "/images/products/17.jpg", "/images/products/17.jpg",
                        "₹3,499.00", "3,499", 3499, "-22%", "₹4,499.00",
                        "Backpack 35L (Laptop Compartment, Water Resistant)",
                        "ACCESSORIES", true, false, false,
                        Arrays.asList(
                                "Laptop sleeve up to 15.6\"",
                                "Water resistant fabric",
                                "Multiple pockets"
                        )),
                createProduct("18", "/images/products/18.jpg", "/images/products/18.jpg",
                        "₹699.00", "699", 699, "-36%", "₹1,099.00",
                        "LED Desk Lamp (Dimmable, USB Powered)",
                        "HOME", false, true, false,
                        Arrays.asList(
                                "Multiple brightness levels",
                                "USB powered",
                                "Eye-care light"
                        )),
                createProduct("19", "/images/products/19.jpg", "/images/products/19.jpg",
                        "₹8,990.00", "8,990", 8990, "-18%", "₹10,990.00",
                        "Office Chair (Ergonomic, Lumbar Support, Mesh)",
                        "HOME", true, false, false,
                        Arrays.asList(
                                "Breathable mesh back",
                                "Lumbar support",
                                "Adjustable height and tilt"
                        )),
                createProduct("20", "/images/products/20.jpg", "/images/products/20.jpg",
                        "₹5,499.00", "5,499", 5499, "-31%", "₹7,999.00",
                        "Wi‑Fi Router Dual Band (AC1200, Gigabit Ports)",
                        "ELECTRONICS", true, true, false,
                        Arrays.asList(
                                "Dual-band Wi‑Fi",
                                "Gigabit ports",
                                "Guest network"
                        )),
                createProduct("21", "/images/products/21.jpg", "/images/products/21.jpg",
                        "₹1,799.00", "1,799", 1799, "-25%", "₹2,399.00",
                        "Bluetooth Portable Speaker (Water Resistant, 12h Playtime)",
                        "ELECTRONICS", false, true, false,
                        Arrays.asList(
                                "12-hour battery",
                                "Water resistant",
                                "Strong bass"
                        )),
                createProduct("22", "/images/products/22.jpg", "/images/products/22.jpg",
                        "₹2,299.00", "2,299", 2299, "-23%", "₹2,999.00",
                        "Men's Analog Watch (Stainless Steel, Water Resistant)",
                        "ACCESSORIES", true, false, true,
                        Arrays.asList(
                                "Classic analog design",
                                "Water resistant",
                                "Quartz movement"
                        )),
                createProduct("23", "/images/products/23.jpg", "/images/products/23.jpg",
                        "₹49,990.00", "49,990", 49990, "-29%", "₹69,990.00",
                        "5G Smartphone (8GB RAM, 256GB Storage, AMOLED Display)",
                        "MOBILES", true, true, true,
                        Arrays.asList("6.7-inch AMOLED | 120Hz", "Fast charging", "256GB storage")),
                createProduct("24", "/images/products/24.jpg", "/images/products/24.jpg",
                        "₹19,999.00", "19,999", 19999, "-33%", "₹29,999.00",
                        "Budget 5G Phone (6GB RAM, 128GB Storage)",
                        "MOBILES", false, true, true,
                        Arrays.asList("5000mAh battery", "Expandable storage", "Dual camera")),
                createProduct("25", "/images/products/25.jpg", "/images/products/25.jpg",
                        "₹7,499.00", "7,499", 7499, "-25%", "₹9,999.00",
                        "True Wireless Earbuds (ANC, 30h Playback)",
                        "ELECTRONICS", true, true, true,
                        Arrays.asList("ANC + transparency mode", "Low latency mode", "USB-C case")),
                createProduct("26", "/images/products/26.jpg", "/images/products/26.jpg",
                        "₹3,299.00", "3,299", 3299, "-34%", "₹4,999.00",
                        "Smartwatch (AMOLED, Bluetooth Calling, GPS)",
                        "ACCESSORIES", true, true, true,
                        Arrays.asList("Bluetooth calling", "GPS + fitness tracking", "SpO2 + HR monitor")),
                createProduct("27", "/images/products/27.jpg", "/images/products/27.jpg",
                        "₹1,999.00", "1,999", 1999, "-20%", "₹2,499.00",
                        "USB-C GaN Charger 65W (Dual Port)",
                        "ACCESSORIES", false, true, false,
                        Arrays.asList("65W fast charging", "Dual port", "Compact GaN design")),
                createProduct("28", "/images/products/28.jpg", "/images/products/28.jpg",
                        "₹2,199.00", "2,199", 2199, "-21%", "₹2,799.00",
                        "Bluetooth Neckband Earphones (Magnetic Buds)",
                        "ELECTRONICS", false, true, false,
                        Arrays.asList("Deep bass drivers", "Fast charge", "Comfort fit")),
                createProduct("29", "/images/products/29.jpg", "/images/products/29.jpg",
                        "₹2,999.00", "2,999", 2999, "-25%", "₹3,999.00",
                        "Men's Casual Sneakers (Cushioned Sole)",
                        "SHOES", true, true, false,
                        Arrays.asList("Lightweight comfort", "Non-slip outsole", "Breathable upper")),
                createProduct("30", "/images/products/30.jpg", "/images/products/30.jpg",
                        "₹3,199.00", "3,199", 3199, "-20%", "₹3,999.00",
                        "Women's Running Shoes (Breathable Mesh)",
                        "SHOES", true, true, true,
                        Arrays.asList("Breathable mesh", "Shock absorption", "Daily running ready"))
        );
    }

    private Product createProduct(String id, String url, String resUrl, String price, String value,
                                  Integer accValue, String discount, String mrp, String name,
                                  String category, boolean bestSeller, boolean todayDeal, boolean newRelease,
                                  List<String> points) {
        Product product = new Product();
        product.setId(id);
        product.setUrl(url);
        product.setResUrl(resUrl);
        product.setPrice(price);
        product.setValue(value);
        product.setAccValue(accValue);
        product.setDiscount(discount);
        product.setMrp(mrp);
        product.setName(name);
        product.setCategory(category == null || category.isBlank()
                ? "ELECTRONICS"
                : category.trim().toUpperCase(Locale.ROOT));
        product.setBestSeller(bestSeller);
        product.setTodayDeal(todayDeal);
        product.setNewRelease(newRelease);

        List<ProductPoint> productPoints = (points == null ? List.<String>of() : points).stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(point -> {
                    ProductPoint pp = new ProductPoint();
                    pp.setProduct(product);
                    pp.setPoint(point);
                    return pp;
                })
                .toList();

        product.setPoints(productPoints);
        return product;
    }
}
