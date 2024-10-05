<?php

class CategoryController
{
    private $categoryModel;

    public function __construct($categoryModel)
    {
        $this->categoryModel = $categoryModel;
    }

    public function getCategories()
    {
        return $this->categoryModel->fetchAllCategoriesWithChildren();
    }
}