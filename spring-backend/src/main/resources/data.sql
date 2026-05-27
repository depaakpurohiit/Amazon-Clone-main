-- PostgreSQL Data Seed for Amazon Clone Backend
-- This file seeds the database with all products in their correct categories

-- Clear existing data (if migrations run first)
DELETE FROM order_products;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM product_points;
DELETE FROM products;

-- ==========================================
-- ELECTRONICS CATEGORY
-- ==========================================

-- Product 1: Lenovo ThinkBook 14 Laptop
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555551', 'https://m.media-amazon.com/images/I/71jG+e7roXL._SL1500_.jpg', 'https://m.media-amazon.com/images/I/71jG+e7roXL._SL1500_.jpg', '₹61,990.00', '61,990', 61990, '-46%', '₹1,15,668.00', 'Lenovo ThinkBook 14 Intel Core i5 11th Gen 14 inch (35.56cm) FHD IPS Thin & Light Laptop (16GB RAM/512GB SSD/Windows 11 Home/MS Office 2021/FPR/Intel Iris Xe Graphics Mineral Grey/1.4 kg), 20VDA0TLIH', 'ELECTRONICS', true, true, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555551', 'ThinkBook 14 Reliability tested on 12 MIL-STD-810H Methods and 22 Procedures | Body Material: Aluminium | Surface Treatment: Anodizing sandblasting | Built to withstand rugged usage and can handle accidental knocks, drops, and even spills'),
('11111111-2222-3333-4444-555555555551', 'Processor: 11th Gen Intel Core i5-1135G7, 2.4 Ghz base clock, 4.2 Ghz max boost clock, 4 Cores, 8 MB Cache | Memory: 16GB (8GB soldered + 8GB SO-DIMM) RAM DDR4-3200 MHz upgradable upto 40 GB | Storage: 512GB SSD M.2'),
('11111111-2222-3333-4444-555555555551', 'Operating System: Preloaded Windows 11 Home with Lifetime Validity | Pre-installed software: Microsoft Office Home & Student 2021'),
('11111111-2222-3333-4444-555555555551', 'Display: 14-inch (35.56 cm) screen with (1920X1080) Full HD IPS 250 nits Antiglare display | Graphics: Integrated Intel Iris Xe Graphics comes with DirectX 12 enables amazing graphics | Monitor Support: Supports up to 4 independent displays'),
('11111111-2222-3333-4444-555555555551', 'Ports: 2x USB 3.2 Gen 1 (1x Always On), 1x USB-C 3.2 Gen 2 (support data transfer, PD 3.0 and DP 1.4), 1x Thunderbolt 4 / USB4 40Gbps (support data transfer, PD 3.0 and DP 1.4), 1x HDMI 1.4b, 1x Card reader, 1x Ethernet (RJ-45), 1x Headphone / microphone combo jack (3.5mm)');

-- Product 3: Apple AirPods Pro
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555553', 'https://m.media-amazon.com/images/I/61SUj2aKoEL._SL1500_.jpg', 'https://m.media-amazon.com/images/I/61SUj2aKoEL._SL1500_.jpg', '₹21,900.00', '21,900', 21900, '-12%', '₹24,900.00', 'New Apple AirPods Pro with MagSafe Charging Case', 'ELECTRONICS', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555553', 'Active Noise Cancellation blocks outside noise, so you can immerse yourself in music'),
('11111111-2222-3333-4444-555555555553', 'Transparency mode for hearing and interacting with the world around you'),
('11111111-2222-3333-4444-555555555553', 'Spatial audio with dynamic head tracking places sound all around you'),
('11111111-2222-3333-4444-555555555553', 'Adaptive EQ automatically tunes music to your ears'),
('11111111-2222-3333-4444-555555555553', 'Three sizes of soft, tapered silicone tips for a customisable fit');

-- Product 4: boAt Airdopes 121v2
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555554', 'https://m.media-amazon.com/images/I/61KNJav3S9L._SL1500_.jpg', 'https://m.media-amazon.com/images/I/61KNJav3S9L._SL1500_.jpg', '₹1,299.00', '1,299', 1299, '-57%', '₹2,990.00', 'boAt Airdopes 121v2 True Wireless Earbuds with Upto 14 Hours Playback, Lightweight Earbuds, 8MM Drivers, LED Indicators and Multifunction Controls(Active Black)', 'ELECTRONICS', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555554', 'Playback- Airdopes 121v2 offers a nonstop playback of up to 3.5H with each charge and an additional 10.5H playtime with the included charging case'),
('11111111-2222-3333-4444-555555555554', 'Lightweight- With a dual tone finish on a lightweight ergonomic design weighing just around 4g per earbud, get ready to groove in full flow with Airdopes 121v2v2 TWS earbuds'),
('11111111-2222-3333-4444-555555555554', 'Drivers- It possesses powerful 8mm drivers that pump out immersive auditory experience all day long'),
('11111111-2222-3333-4444-555555555554', 'Battery Indicator- Its carry cum charge case also has the battery LED indicator that shows the remaining power for the case'),
('11111111-2222-3333-4444-555555555554', 'Controls- The true wireless earbuds offer easy access multifunction button controls with stereo calling feature for an overall seamless user experience.');

-- Product 8: QUBO Smart Cam 360
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555558', 'https://m.media-amazon.com/images/I/61kFQz2G7tL._SL1500_.jpg', 'https://m.media-amazon.com/images/I/61kFQz2G7tL._SL1500_.jpg', '₹2,884.00', '2,884', 2884, '-28%', '₹3,990.00', 'QUBO Smart Cam 360 | 1080p Full HD Wi-Fi Camera | Trust of Hero Group | 360° Deg Coverage with Pan & Tilt | Intruder Alarm | Full Color in Low Light | Two Way Talk | Alexa & OK Google | Made in India', 'ELECTRONICS', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555558', 'PROUDLY INDIAN: Qubo Smart Cam 360 is Designed & Made in INDIA. Engineered for the Security Needs of the Indian Market.'),
('11111111-2222-3333-4444-555555555558', 'TRUST OF HERO GROUP: Our Round-the-Clock Customer Service & Wide field Network not only resolves your all concerns & queries but rather ensures complete peace of mind for Lifetime.'),
('11111111-2222-3333-4444-555555555558', '360 COVERAGE: Multi-Directional rotation of the lens ensures that there are no blind spots. NOTE: Qubo Smart Cam 360 is designed to be used indoors only.'),
('11111111-2222-3333-4444-555555555558', 'THEFT PROOF CLOUD STORAGE: Secure all your recordings on cloud storage based in India. Your private home moments stay with you even if the device is stolen.'),
('11111111-2222-3333-4444-555555555558', 'PERSON DETECTION WITH INTRUDER ALARM : Advanced AI capabilities that can smartly detect & notify whenever a person is detected. You can also ring an automatic loud siren in case of an intrusion.');

-- Product 13: boAt Stone 1200 Speaker
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555560', 'https://m.media-amazon.com/images/I/71lUj0xR9HL._SL1500_.jpg', 'https://m.media-amazon.com/images/I/71lUj0xR9HL._SL1500_.jpg', '₹3,999.00', '3,999', 3999, '-43%', '₹6,990.00', 'boAt Stone 1200 14W Bluetooth Speaker with Upto 9 Hours Battery, RGB LEDs, IPX7 and TWS Feature(Blue)', 'ELECTRONICS', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555560', 'It delivers a powerful 14W stereo sound for a complete immersive experience.'),
('11111111-2222-3333-4444-555555555560', 'Stone 1200 provides a battery time of upto 9 hours without its RGB LEDs and upto 7 hours with it(@60% volume) with a charging time of 4 hours.'),
('11111111-2222-3333-4444-555555555560', 'Carry your splashproof speakers to anywhere with IPX7 splash & water shield leaving behind the tension of water running over'),
('11111111-2222-3333-4444-555555555560', 'Add a second speaker with our TWS technology and enjoy sound, twice as powerful, Battery Capacity (mAh) - 3600 mAh, Playback Time - 9 hours, Charging Time - 4 hours, Standby Time 360 hours'),
('11111111-2222-3333-4444-555555555560', 'Its 360-degree ergonomic design makes it ideal to be carried around anywhere you go. It also comes with a carry strap making it very convenient for you to carry it around.');

-- ==========================================
-- MOBILES CATEGORY
-- ==========================================

-- Product 2: Samsung Galaxy S20 FE
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555552', 'https://m.media-amazon.com/images/I/81vDZyJQ-4L._SL1500_.jpg', 'https://m.media-amazon.com/images/I/81vDZyJQ-4L._SL1500_.jpg', '₹39,499.00', '39,499', 39499, '-47%', '₹74,999.00', 'Samsung Galaxy S20 FE 5G (Cloud Navy, 8GB RAM, 128GB Storage) with No Cost EMI & Additional Exchange Offers', 'MOBILES', true, true, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555552', '5G Ready powered by Qualcomm Snapdragon 865 Octa-Core processor, 8GB RAM, 128GB internal memory expandable up to 1TB, Android 11.0 operating system and dual SIM'),
('11111111-2222-3333-4444-555555555552', 'Triple Rear Camera Setup - 12MP (Dual Pixel) OIS F1.8 Wide Rear Camera + 8MP OIS Tele Camera + 12MP Ultra Wide | 30X Space Zoom, Single Take & Night Mode | 32MP F2.2 Front Punch Hole Camera'),
('11111111-2222-3333-4444-555555555552', '6.5-inch(16.40 centimeters) Infinity-O Super AMOLED Display with 120Hz Refresh rate, 1080 x 2400 (FHD+) Resolution'),
('11111111-2222-3333-4444-555555555552', '4500 mAh battery (Non -removable) with Super Fast Charging, FAst Wireless Charging & Finger Print sensor'),
('11111111-2222-3333-4444-555555555552', 'IP68 Rated, MicroSD Card Slot (Expandable upto 1 TB), Dual Nano Sim, Hybrid Sim Slot, 5G+5G Dual stand by');

-- ==========================================
-- FASHION CATEGORY
-- ==========================================

-- Product 6: crocs Bayaband Clog
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555555', 'https://m.media-amazon.com/images/I/71KLi9R6Z-L._UL1500_.jpg', 'https://m.media-amazon.com/images/I/71KLi9R6Z-L._UL1500_.jpg', '₹2,097.00', '2,097', 2097, '-40%', '₹3,495.00', 'crocs Unisex-Adult Bayaband Clog', 'FASHION', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555555', 'Sole: Ethylene Vinyl Acetate'),
('11111111-2222-3333-4444-555555555555', 'Outer Material: EVA. Washes off with soap and water'),
('11111111-2222-3333-4444-555555555555', 'Closure Type: Slip On'),
('11111111-2222-3333-4444-555555555555', 'Shoe Width: Regular');

-- Product 7: INDO ERA Kurta Palazzo
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555556', 'https://m.media-amazon.com/images/I/71P0l7dGv-L._UL1500_.jpg', 'https://m.media-amazon.com/images/I/71P0l7dGv-L._UL1500_.jpg', '₹1,619.00', '1,619', 1619, '-60%', '₹3,999.00', 'INDO ERA Women''s Viscose Embroidered Straight Kurta Palazzo With Dupatta Set', 'FASHION', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555556', 'Care Instructions: Dry Clean Only'),
('11111111-2222-3333-4444-555555555556', 'Fit Type: Regular'),
('11111111-2222-3333-4444-555555555556', 'Print & Pattern : Solid ; Package Contant : Kurta, Palazzo With Dupatta');

-- Product 9: TIMEX Watch
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555559', 'https://m.media-amazon.com/images/I/71pAb9Smi9L._UL1500_.jpg', 'https://m.media-amazon.com/images/I/71pAb9Smi9L._UL1500_.jpg', '₹1,299.00', '1,299', 1299, '-19%', '₹1,595.00', 'TIMEX Analog Men''s Watch', 'FASHION', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555559', 'Case Shape: Round, Dial Glass Material: Mineral, Band material: Leather'),
('11111111-2222-3333-4444-555555555559', 'Watch Movement Type: Quartz, Watch Display Type: Analog'),
('11111111-2222-3333-4444-555555555559', 'Case Material: Brass, Case Diameter: 40 millimeters, Brass Bezel ; Case Thickness: 8.8mm'),
('11111111-2222-3333-4444-555555555559', 'Water Resistance Depth: 30 meters, Buckle Clasp'),
('11111111-2222-3333-4444-555555555559', 'Ideal for birthday, anniversary and wedding gift');

-- Product 11: Integriti Men Sweatshirt
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555561', 'https://m.media-amazon.com/images/I/61K5q0M6uML._UL1500_.jpg', 'https://m.media-amazon.com/images/I/61K5q0M6uML._UL1500_.jpg', '₹358.00', '358', 358, '-86%', '₹2,499.00', 'Integriti Men Sweatshirt', 'FASHION', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555561', 'Care Instructions: Machine Wash'),
('11111111-2222-3333-4444-555555555561', 'Fit Type: Modern'),
('11111111-2222-3333-4444-555555555561', 'Hooded, Long Sleeve, Print'),
('11111111-2222-3333-4444-555555555561', 'Package Dimensions: 10.7 L x 39.6 H x 38.0 W (centimeters)');

-- Product 12: Harpa Dress
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555562', 'https://m.media-amazon.com/images/I/71dNqglQnJL._SL1500_.jpg', 'https://m.media-amazon.com/images/I/71dNqglQnJL._SL1500_.jpg', '₹630.00', '630', 630, '-70%', '₹2,099.00', 'Harpa Synthetic a-line Dress (GR5759_Navy_Small)', 'FASHION', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555562', 'Care Instructions: Hand Wash Only'),
('11111111-2222-3333-4444-555555555562', 'Color name: pink'),
('11111111-2222-3333-4444-555555555562', '100% Polyester'),
('11111111-2222-3333-4444-555555555562', 'Hand wash; A-line'),
('11111111-2222-3333-4444-555555555562', 'Sleeveless');

-- ==========================================
-- HOME CATEGORY
-- ==========================================

-- Product 5: Mosquito Net
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555557', 'https://m.media-amazon.com/images/I/81DkpzVxVEL._SL1500_.jpg', 'https://m.media-amazon.com/images/I/81DkpzVxVEL._SL1500_.jpg', '₹999.00', '999', 999, '-50%', '₹2,000.00', 'Classic Mosquito Net for Double Bed, Embroidery, King Size, Polyester, Strong 30GSM, PVC Coated Steel (L200cm X W200cm X H145cm) Foldable for Double Bed - King Size, Blue', 'HOME', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555557', 'Size of Double bed is 200cm X 200cm X 145cm (i.e. 6.56ft X 6.56ft X 4.75ft) can Easily accommodate bed for King size, Super King size bed. Suitable for 2 Adults & 1 Child.'),
('11111111-2222-3333-4444-555555555557', 'Easily Washable (steel wires are corrosion resistant), Self-Supporting, No Requirement to nail the wall.'),
('11111111-2222-3333-4444-555555555557', 'Pops up in an Instant and Automatically, Can be folded in less than 30 Seconds.'),
('11111111-2222-3333-4444-555555555557', 'Storage Bag Included at free of cost, comes with patches to cover the future accidental holes in the mosquito net, Provided with large Zipper gates on two Sides with inner and outer runner for easy and convenient Entry and Exit.'),
('11111111-2222-3333-4444-555555555557', 'Easy to fold, Easy to carry, it offers a healthy environment to sleep in.');

-- Product 10: Yogabar Muesli
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555563', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', '₹429.00', '429', 429, '-14%', '₹499.00', 'Yogabar Dark Chocolate & Cranberry Muesli 700g - Breakfast Cereal with 83% Nuts & Seeds, Dried Fruits, & Whole Grains - Vegan & Gluten Free Snack', 'HOME', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555563', 'Whole grains: Quinoa, Oats and Brown Rice'),
('11111111-2222-3333-4444-555555555563', 'Made from 100% natural ingredients'),
('11111111-2222-3333-4444-555555555563', 'Rich in nuts and dried fruits: almonds, raisins, dried cranberries rich in seeds: pumpkin, chia and flax'),
('11111111-2222-3333-4444-555555555563', 'Antioxidant rich dark chocolate + cranberry'),
('11111111-2222-3333-4444-555555555563', 'Slow-roasted, slow ground in small batches for superior flavour');

-- Product 14: Cast Iron Candle Holder
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555564', 'https://m.media-amazon.com/images/I/71L0lA7Q6-L._SL1500_.jpg', 'https://m.media-amazon.com/images/I/71L0lA7Q6-L._SL1500_.jpg', '₹699.00', '699', 699, '-53%', '₹1,499.00', 'Interiocrafts Cast Iron Degchi Style Dhoop and Tealight Candle Holder', 'HOME', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555564', 'It can be used as a dhoop dani with the lid on and candle holder with votive stand. A perfect item for your pooja mandir.'),
('11111111-2222-3333-4444-555555555564', 'The chic functionality of this beautiful votive candle and dhoop holder is inimitable.'),
('11111111-2222-3333-4444-555555555564', 'Rajasthan is famous for its handicrafts and the creativity of the artists can clearly be seen with use of artifacts.'),
('11111111-2222-3333-4444-555555555564', 'It will not get heated up while use; It is easy to hold for doing ''Dhuni'' in your entire house.'),
('11111111-2222-3333-4444-555555555564', 'It can be used for inserting loban, bakhoor, samarni dhoop incense sticks');

-- Product 15: Flower Vase
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555565', 'https://m.media-amazon.com/images/I/71X8jCk0pBL._SL1500_.jpg', 'https://m.media-amazon.com/images/I/71X8jCk0pBL._SL1500_.jpg', '₹499.00', '499', 499, '-50%', '₹1,000.00', 'Urban Born Cast Iron Metal Flower vase for Home Decor and Living Room Vintage Antique Decor (Gold, 15 x 15 x 15 cm)', 'HOME', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555565', 'This flower vase is made from one Piece of Iron with unique Decorative design.'),
('11111111-2222-3333-4444-555555555565', 'Item size : HXW : 15 x 15 cm / Finish- Gold'),
('11111111-2222-3333-4444-555555555565', 'Package contains -1pc Flower vase without Flowers. Good-quality and stylish products. Flowers are for illustration purpose not with Vase.'),
('11111111-2222-3333-4444-555555555565', 'Great for gifting purposes in Diwali, Birthday, Anniversary, Corporate party etc.');

-- Product 16: Curtains
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555566', 'https://m.media-amazon.com/images/I/71xM8h6p5SL._SL1500_.jpg', 'https://m.media-amazon.com/images/I/71xM8h6p5SL._SL1500_.jpg', '₹999.00', '999', 999, '-33%', '₹1,499.00', 'Livpure Smart Solid Window Polyester 5 feet Curtains with tieback( Beige ) Set', 'HOME', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555566', 'Color: Beige Size: 5 Feet Material: Polyester Package Contents: 2 Window Curtains Attached tiebacks: Yes (Velcro) Window Curtain Dimensions: 152.4 x 132 CM. | 60 x 52 INCH'),
('11111111-2222-3333-4444-555555555566', 'Blackout: Blocks 95% sunlight from passing through the curtains Noise reduction: Blocks most of the street noise & keeps the inside undisturbed UV protection: Blocks UV rays from sunlight to pass through into your home Temperature insulation: Blocks heat transfer and helps in maintaining the AC efficiency'),
('11111111-2222-3333-4444-555555555566', 'Unique 3-Weave Technology: Livpure curtains are made using Triple Weave Technology with three layers of fabric strongly interwoven to ensure effective blackout, protection from the UV rays and insulate your home'),
('11111111-2222-3333-4444-555555555566', 'Hanging Style: These curtains are easy to install and come with high quality eyelet rings Eyelet Rings: Detachable with 1.5 in inner diameter for the curtain to fit nicely Wash Care: Hands & Machine washable after removing the eyelets, Do not bleed color'),
('11111111-2222-3333-4444-555555555566', 'Product color may slightly vary due to photographic lighting sources or your monitor settings');

-- Product 17: Door Mat
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555567', 'https://m.media-amazon.com/images/I/81A8l6R1m4L._SL1500_.jpg', 'https://m.media-amazon.com/images/I/81A8l6R1m4L._SL1500_.jpg', '₹399.00', '399', 399, '-60%', '₹999.00', 'VMPS | Door mats Anti Skid for Home, 40x60 cm Pack of 1 ( Grey ) - Water Absorbent Rugs', 'HOME', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555567', 'Super Absorbent Doormat: Made of 55% cotton + 45% microfiber, the magic clean mat can easily scrap off mud, dirt, dust, grit, snow, slush, sleet and grass from shoes instantly.'),
('11111111-2222-3333-4444-555555555567', 'Non-slip: the non-slip bathroom mat for home is backed with tp rubber to prevent shifting and skidding. Caution : place rug on clean dry smooth floor only. Water under rug can cause it to slip. Keep bottom of rug dry.'),
('11111111-2222-3333-4444-555555555567', 'Ultra absorbent: the microfiber washroom door mat is much more absorbent than normal bathmats. High-pile helps save your floors from dripping water.'),
('11111111-2222-3333-4444-555555555567', 'Size of Doormats is 16 X 24 inches or 40 X 60 cm or 1.5 ft X 2 ft, ideal for size of your Indoor Entrances, Weight of Single Piece is around 500 Grams'),
('11111111-2222-3333-4444-555555555567', 'A high quality Microfiber doormats with heat resistance and non-irritating odour');

-- Product 18: Cushion Cover
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555568', 'https://m.media-amazon.com/images/I/81xJ6R0Q9TL._SL1500_.jpg', 'https://m.media-amazon.com/images/I/81xJ6R0Q9TL._SL1500_.jpg', '₹699.00', '699', 699, '-42%', '₹1,199.00', 'Trending Home Collection Cushion Cover with Booti Zari Embroidered Stitched Zippered Cotton Velvet Cushion Cover | 16X16 Inches | Set of 2| (Yellow)', 'HOME', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555568', 'Size: 16 X 16 inches/ 40 cm x 40 cm . Only Booti Zari embroidered velvet cushion cover, FILLER ARE NOT INCLUDED. Square pillowcase is suitable for home decor, couch, sofa, chair, bed, car, party, hotel, office, cafe décor'),
('11111111-2222-3333-4444-555555555568', 'Fabric Material: The cushion cover is made of Azo free dye with environment friendly ZARI embroidered export quality cotton velvet fabric . The fabric is sturdy durable, not easily breaking or tearing.'),
('11111111-2222-3333-4444-555555555568', 'Decoration - All the cushion cover are made by exclusive color and design. You can also use as a gift pack as it comes in beautiful packaging.'),
('11111111-2222-3333-4444-555555555568', 'Care Instruction - Dry clean only, No Bleach, No Tumble Dry, Iron at Back Side'),
('11111111-2222-3333-4444-555555555568', 'Made in India');

-- Product 19: Comforter Set
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555569', 'https://m.media-amazon.com/images/I/81g0tT9hWkL._SL1500_.jpg', 'https://m.media-amazon.com/images/I/81g0tT9hWkL._SL1500_.jpg', '₹1,399.00', '1,399', 1399, '-72%', '₹4,999.00', 'NEW LEAF 220 GSM All-Season Printed Super Soft Light Weight Cotton Comforter Set with 1 Bedsheet 2 Pillow Covers (Double, Blue, Orange) -4 Pieces', 'HOME', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555569', 'The king size quilt set includes - 1pc Bedsheet 1 quilt (100 inch x 90 inch), 2pcs cover ( 18 inch x 28 inch)'),
('11111111-2222-3333-4444-555555555569', 'New Embroidered artwork makes the quilts much more durable and lightweight rather than the traditional stitching technique.'),
('11111111-2222-3333-4444-555555555569', 'The cover and filling are made of 100% Microfiber.'),
('11111111-2222-3333-4444-555555555569', 'The geometric classic pattern is easy to match your bedroom decor, offering you an elegant and classic feeling.'),
('11111111-2222-3333-4444-555555555569', 'Machine wash cold, gentle cycle, only non-chlorine bleach when needed, tumble dry low, steam if needed, do not iron. No shrinkage, No colour fading and No unravelling after washing.');

-- Product 20: Tealight Holder
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555570', 'https://m.media-amazon.com/images/I/71YxwS6s7TL._SL1500_.jpg', 'https://m.media-amazon.com/images/I/71YxwS6s7TL._SL1500_.jpg', '₹329.00', '329', 329, '-63%', '₹899.00', 'Kaameri Bazaar Bronze Color Metal Bird cage Tea Light Holder with Butter Pot tealight Glass for Home Décor', 'HOME', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555570', 'This Diwali Light Your home with this beautiful Bird Cage Tealight Holder'),
('11111111-2222-3333-4444-555555555570', 'This stunning Kaameri Bazaar Tealight Holder makes for a perfect addition to your home.'),
('11111111-2222-3333-4444-555555555570', 'BENEFITS: They can accent your home or office for the right decor. Perfect for adding a decorative touch to any room''s decor'),
('11111111-2222-3333-4444-555555555570', 'Made from high quality material, Durable and Long lasting'),
('11111111-2222-3333-4444-555555555570', 'Ideal For: Decoration, Gifting, Diwali Decoration, Christmas Party Decoration, Home Decor, Candle Light Dinner');

-- Product 21: Ceramic Pot/Vase
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555571', 'https://m.media-amazon.com/images/I/71M8w7Yp6EL._SL1500_.jpg', 'https://m.media-amazon.com/images/I/71M8w7Yp6EL._SL1500_.jpg', '₹549.00', '549', 549, '-63%', '₹1,499.00', 'The Vintage Artefacts Donut White, Ceramic Pot and vase Handcrafted, Round Shaped (vase)', 'HOME', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555571', 'This stunning ceramic pot vase makes for a perfect addition to your home.'),
('11111111-2222-3333-4444-555555555571', 'BENEFITS: They can accent your home or office for the right decor. Perfect for adding a decorative touch to any room''s decor'),
('11111111-2222-3333-4444-555555555571', 'Made from high quality material, Durable and Long lasting'),
('11111111-2222-3333-4444-555555555571', 'Ideal For: Decoration, Gifting, Home Decor, Interior Design'),
('11111111-2222-3333-4444-555555555571', 'Handcrafted with authentic design elements');

-- Product 22: Wooden Elephant Table
INSERT INTO "products" ("id", "url", "res_url", "price", "value", "acc_value", "discount", "mrp", "name", "category", "best_seller", "today_deal", "new_release") VALUES
('11111111-2222-3333-4444-555555555572', 'https://m.media-amazon.com/images/I/81f8P6f8g6L._SL1500_.jpg', 'https://m.media-amazon.com/images/I/81f8P6f8g6L._SL1500_.jpg', '₹1,499.00', '1,499', 1499, '-44%', '₹2,699.00', 'JH Gallery Handcrafted and Emboss Painted Colorful Wood Elephant Shape Garden Table (8 Inches Height, Red)', 'HOME', false, false, false);

INSERT INTO "product_points" ("product_id", "point") VALUES
('11111111-2222-3333-4444-555555555572', 'JH Gallery Presents Hand crafted Or Hand Painted decorative wooden small Elephant Stool Multicolored which widely used in worldwide to decor balcony, office stool, living room, side table.'),
('11111111-2222-3333-4444-555555555572', 'Package Content - One Wooden Elephant Statue Table Cum Stool/Handcrafted with Artistic Painting'),
('11111111-2222-3333-4444-555555555572', 'Perfect For Decor as Table It''s very suitable for gifting as it comes in best packaging as well. Perfect for using end table nightstand, kids step stool, night stand, keeping your planters, as a stand'),
('11111111-2222-3333-4444-555555555572', 'Care Instruction : table away from warmth , heat and sunshine. Use dry/wet cotton cloth to remove dirt.'),
('11111111-2222-3333-4444-555555555572', '100% Handmade :- Handmade by recognized Artisans from JH Gallery Rajasthan, product created under Make in INDIA');