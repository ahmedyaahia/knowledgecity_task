CREATE TABLE courses (
    course_id VARCHAR(12) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_preview VARCHAR(255),
    category_id VARCHAR(36),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);


