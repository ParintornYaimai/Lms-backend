
/**
 * @swagger
 * /api/enrolled:
 *   get:
 *     summary: Get all courses that the student hasn't enrolled in yet
 *     tags: [Enrolled]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses
 *       403:
 *         description: Forbidden - You don't have permission
 */

/**
 * @swagger
 * /api/enrolled/cate:
 *   get:
 *     summary: Get categories to use as filters
 *     tags: [Enrolled]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 */

/**
 * @swagger
 * /api/enrolled/subcate/{id}:
 *   get:
 *     summary: Get subcategories to use as filters
 *     tags: [Enrolled]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Subcategory ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of subcategories
 */

/**
 * @swagger
 * /api/enrolled/getCourseBySubCate/{id}:
 *   get:
 *     summary: Get courses based on a subcategory ID
 *     tags: [Enrolled]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Subcategory ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses
 */

/**
 * @swagger
 * /api/enrolled/{id}:
 *   get:
 *     summary: Get details of a specific course
 *     tags: [Enrolled]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Course ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Course details
 */


/**
 * @swagger
 * /api/enrolled/{id}:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Enrolled]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Course ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully enrolled
 *       400:
 *         description: Bad Request - Invalid data
 */

