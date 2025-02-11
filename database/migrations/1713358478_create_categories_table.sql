CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),  
    name VARCHAR(255) NOT NULL,
    parent VARCHAR(36) DEFAULT NULL,
    FOREIGN KEY (parent) REFERENCES categories(id) ON DELETE CASCADE
);
