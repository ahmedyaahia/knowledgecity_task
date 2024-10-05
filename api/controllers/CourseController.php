<?php

class CourseController
{
    private $courseModel;

    public function __construct($courseModel)
    {
        $this->courseModel = $courseModel;
    }

    public function getCourses($categoryId = null)
    {
        if ($categoryId) {
            return $this->courseModel->getCoursesByCategory($categoryId);
        } else {
            return $this->courseModel->getAllCourses();
        }
    }
}