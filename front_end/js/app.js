// API Functions
async function fetchCategories() {
    const response = await fetch('http://api.cc.localhost/categories');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const categories = await response.json();
    return categories;
}

async function fetchChildCategories(categoryId) {
    const response = await fetch(`http://api.cc.localhost/categories/${categoryId}/children`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const childCategories = await response.json();
    return childCategories;
}

async function fetchCourses(categoryId) {
    const url = categoryId ? `http://api.cc.localhost/courses?category_id=${categoryId}` : 'http://api.cc.localhost/courses';
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const courses = await response.json();
    return courses;
}

// Data Processing Function
async function fetchCategoriesWithCount() {
    const categories = await fetchCategories();

    // Use a Set to ensure categories are not duplicated
    const seenCategories = new Set();

    const categoriesWithCount = await Promise.all(categories.map(async (category) => {
        if (seenCategories.has(category.id)) {
            return null; 
        }

        const childCategories = await fetchChildCategories(category.id);
        
        const courses = await fetchCourses(category.id);
        const courseCount = courses.length; // Count courses directly related to the category

        const childCount = childCategories.reduce((sum, child) => {
            return sum + (child.course_count || 0);
        }, 0);
        
        const totalCourses = courseCount + childCount; // Include both parent and child courses

        // Mark category as seen
        seenCategories.add(category.id);

        return { ...category, totalCourses, childCategories };
    }));

    // Filter out null values (categories that were skipped)
    return categoriesWithCount.filter(category => category !== null);
}

// Rendering Functions
function renderCategories(categories) {
    const categoryFilter = document.getElementById('category-filter');
    categoryFilter.innerHTML = ''; // Clear previous entries

    const seenCategories = new Set(); // Track seen categories

    // Create a lookup map for quick access to categories by ID
    const categoryMap = categories.reduce((map, category) => {
        map[category.id] = category;
        return map;
    }, {});

    // Group categories by their parent
    const parentChildMap = {};
    categories.forEach(category => {
        const parentId = category.parent || null;
        if (!parentChildMap[parentId]) {
            parentChildMap[parentId] = [];
        }
        parentChildMap[parentId].push(category);
    });

    // Recursive function to render categories by depth
    function renderCategoryTree(parentId = null, depth = 0) {
        if (depth > 4) return; // Stop at max depth of 4

        const categoryGroup = parentChildMap[parentId] || [];
        categoryGroup.forEach(category => {
            // Create a category button
            const categoryItem = document.createElement('button');
            categoryItem.className = 'category-item';
            categoryItem.style.marginLeft = `${depth * 20}px`; // Indent based on depth

            const countText = (category.totalCourses !== undefined && category.totalCourses > 0) 
                              ? ` (${category.totalCourses})` : '';
            categoryItem.innerText = `${category.name || 'Unnamed Category'}${countText}`;

            // Attach event handler to load courses for this category
            categoryItem.onclick = () => loadCourses(category.id, category.name);
            categoryFilter.appendChild(categoryItem);

            // Mark category as seen
            seenCategories.add(category.id);

            // Recursively render subcategories, increasing depth
            renderCategoryTree(category.id, depth + 1);
        });
    }
    renderCategoryTree();
}

function renderCourses(courses) {
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = '';
    if (courses.length === 0) {
        courseList.innerHTML = '<p>No courses found for this category.</p>';
    } else {
        courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            courseCard.innerHTML = `
                <div class="course-image-container">
                    <img src="${course.image_preview || 'default_image_url_here'}" alt="${course.title}" class="course-image">
                    <span class="course-category">${course.category_name || 'Unnamed Category'}</span>
                </div>
                <h3 class="course-title">${course.title || 'Unnamed Course'}</h3>
                <p class="course-description">${course.description.length > 100 ? course.description.slice(0, 100) + '...' : course.description}</p>
            `;
            courseList.appendChild(courseCard);
        });
    }
}

// Load Courses and Initialize
async function loadCourses(categoryId, categoryName) {
    const courses = await fetchCourses(categoryId);
    renderCourses(courses);
    const titleElement = document.getElementById('catalog-title');
    titleElement.innerText = categoryName || 'Course Catalog';
}

// Initialize the application
async function init() {
    const categories = await fetchCategoriesWithCount();
    renderCategories(categories);
    loadCourses();
}

// Start the application
init();
