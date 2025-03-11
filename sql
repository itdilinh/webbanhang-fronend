ALTER TABLE users ADD COLUMN role ENUM('admin', 'user') DEFAULT 'user';
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
ALTER TABLE products ADD COLUMN category_id INT, ADD FOREIGN KEY (category_id) REFERENCES categories(id);
INSERT INTO categories (name) VALUES ('Điện thoại'), ('Laptop'), ('Phụ kiện');
CREATE TABLE discounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INT NOT NULL,
    expiry_date DATETIME NOT NULL
);
CREATE TABLE discounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INT NOT NULL,
    expiry_date DATETIME NOT NULL
);
ALTER TABLE products ADD COLUMN stock INT NOT NULL DEFAULT 10;
UPDATE products SET stock = 20 WHERE id = 1;
UPDATE products SET stock = 15 WHERE id = 2;

