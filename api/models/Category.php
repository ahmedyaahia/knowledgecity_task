<?php

class Category
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function fetchAllCategoriesWithChildren()
    {
        $categories = $this->fetchAllCategories();
        foreach ($categories as &$category) {
            $category['childCategories'] = $this->fetchChildCategories($category['id']);
        }
        return $categories;
    }

    private function fetchAllCategories()
    {
        $query = "SELECT id, name, parent FROM categories";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function fetchChildCategories($parentId)
    {
        $query = "SELECT id, name, parent FROM categories WHERE parent = :parent";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':parent', $parentId, PDO::PARAM_STR); 
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getCategoryWithCourses($id)
    {
        $query = "SELECT * FROM categories WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}