<?php

class Course
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getAllCourses()
    {
        $query = "SELECT courses.*, categories.name AS category_name
                  FROM courses 
                  JOIN categories ON courses.category_id = categories.id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getCoursesByCategory($categoryId)
    {
        $query = "SELECT courses.*, categories.name AS category_name 
                  FROM courses 
                  JOIN categories ON courses.category_id = categories.id 
                  WHERE category_id = :category_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':category_id', $categoryId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}