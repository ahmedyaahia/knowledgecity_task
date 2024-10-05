<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once 'config/database.php';
require_once 'models/Category.php';
require_once 'models/Course.php';
require_once 'controllers/CategoryController.php';
require_once 'controllers/CourseController.php';

$database = new Database();
$db = $database->getConnection();
$categoryModel = new Category($db);
$courseModel = new Course($db);
$categoryController = new CategoryController($categoryModel);
$courseController = new CourseController($courseModel);

try {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        // Handle preflight request
        http_response_code(200);
        exit;
    }

    // Routing logic
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (strpos($_SERVER['REQUEST_URI'], '/categories') !== false) {
            echo json_encode($categoryController->getCategories());
        } elseif (strpos($_SERVER['REQUEST_URI'], '/courses') !== false) {
            $categoryId = $_GET['category_id'] ?? null;
            echo json_encode($courseController->getCourses($categoryId));
        } else {
            // Handle 404 Not Found
            http_response_code(404);
            echo json_encode(['message' => 'Not Found']);
        }
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
