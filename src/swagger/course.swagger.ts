
/**
 * @swagger
 * tags:
 *   - name: Courses
 *     description: API for managing courses
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses for a student
 *     description: Retrieve all courses that the student has enrolled in.
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *       - RefreshToken: []
 *     responses:
 *       200:
 *         description: Successfully fetched enrolled courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: string
 *                       title:
 *                         type: string
 *                       subtitle:
 *                         type: string
 *                       thumbnailurl:
 *                         type: string
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   patch:
 *     summary: Start a course
 *     description: Mark a course as "in-progress" when the student clicks "Launch Course."
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the course to start
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *       - RefreshToken: []
 *     responses:
 *       200:
 *         description: Successfully started the course
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/courses/getInProgressCourses/{courseId}/{enrolledId}:
 *   get:
 *     summary: Get in-progress courses
 *     description: Retrieve courses that are in progress for the given course and enrollment ID.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: The ID of the course
 *         schema:
 *           type: string
 *       - in: path
 *         name: enrolledId
 *         required: true
 *         description: The enrolled ID
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *       - RefreshToken: []
 *     responses:
 *       200:
 *         description: Successfully fetched in-progress courses
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/courses/backoffice:
 *   get:
 *     summary: Get all courses for a teacher
 *     description: Retrieve all courses created by the teacher.
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *       - RefreshToken: []
 *     responses:
 *       200:
 *         description: Successfully fetched teacher's courses
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/courses/backoffice:
 *   post:
 *     summary: Create a course
 *     description: Teachers can create a new course. Each teacher can only create up to 2 courses with the same title and topic.
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the course.
 *                 example: "Introduction to Node.js"
 *               subtitle:
 *                 type: string
 *                 description: A short subtitle of the course.
 *                 example: "Learn the basics of Node.js"
 *               coursecate:
 *                 type: string
 *                 description: The category ID the course belongs to.
 *                 example: "60a5f404b1b63a1f1c8e8c65"
 *               coursesubjectcate:
 *                 type: string
 *                 description: The subcategory ID the course belongs to.
 *                 example: "60a5f404b1b63a1f1c8e8c66"
 *               coursetopic:
 *                 type: string
 *                 description: The main topic of the course.
 *                 example: "Backend Development"
 *               duration:
 *                 type: integer
 *                 description: The duration of the course in minutes.
 *                 example: 120
 *               thumbnailurl:
 *                 type: string
 *                 description: URL for the thumbnail image of the course.
 *                 example: "https://example.com/thumbnail.jpg"
 *               coursematerial:
 *                 type: string
 *                 description: Basic programming concepts, syntax, and examples.
 *                 example: "Basic programming concepts, syntax, and examples."
 *               mainpoint:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Main points covered in the course.
 *                 example: ["Variables", "Loops", "Functions", "Data Structures"]
 *               coursereq:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Prerequisites for the course.
 *                 example: ["Basic Math", "Logical Thinking"]
 *               coursecrm:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     section:
 *                       type: object
 *                       properties:
 *                         sectionname:
 *                           type: string
 *                           description: Name of the section.
 *                           example: "Getting Started"
 *                         content:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               title:
 *                                 type: string
 *                               description:
 *                                 type: string
 *                               type:
 *                                 type: string
 *                                 enum: [video, text, pdf]
 *                               url:
 *                                 type: string
 *                               duration:
 *                                 type: integer
 *                                 description: Duration in minutes.
 *                           description: Content covered in this section.
 *                           example:
 *                             - title: "Introduction"
 *                               description: "Overview of the course and objectives"
 *                               type: "video"
 *                               url: "https://example.com/video1.mp4"
 *                               duration: 10
 *                             - title: "Setting Up Environment"
 *                               description: "Installing tools and setting up the environment"
 *                               type: "text"
 *                               url: "https://example.com/setup-guide.pdf"
 *                               duration: 15
 *               welmsg:
 *                 type: string
 *                 description: Welcome message for the course.
 *                 example: "Welcome to the course!"
 *               conmsg:
 *                 type: string
 *                 description: Completion message for the course.
 *                 example: "Congratulations on finishing the course!"
 *               createby:
 *                 type: string
 *                 description: The ID of the teacher creating the course.
 *                 example: "60a5f404b1b63a1f1c8e8c67"
 *     security:
 *       - BearerAuth: []
 *       - RefreshToken: []
 *     responses:
 *       201:
 *         description: Successfully created the course.
 *       400:
 *         description: Validation error or bad request (e.g., invalid data).
 *       403:
 *         description: Forbidden (e.g., teacher trying to create more than 2 courses with the same title and topic).
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/courses/backoffice/{courseId}:
 *   patch:
 *     summary: Update a course
 *     description: Teacher can update an existing course they created. The teacher can only update their own courses.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: The ID of the course to update.
 *         schema:
 *           type: string
 *           example: "60a5f404b1b63a1f1c8e8c67"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the course.
 *                 example: "Introduction to Node.js"
 *               subtitle:
 *                 type: string
 *                 description: A short subtitle of the course.
 *                 example: "Learn the basics of Node.js"
 *               coursecate:
 *                 type: string
 *                 description: The category ID the course belongs to.
 *                 example: "60a5f404b1b63a1f1c8e8c65"
 *               coursesubjectcate:
 *                 type: string
 *                 description: The subcategory ID the course belongs to.
 *                 example: "60a5f404b1b63a1f1c8e8c66"
 *               coursetopic:
 *                 type: string
 *                 description: The main topic of the course.
 *                 example: "Backend Development"
 *               duration:
 *                 type: integer
 *                 description: The duration of the course in minutes.
 *                 example: 120
 *               thumbnailurl:
 *                 type: string
 *                 description: URL for the thumbnail image of the course.
 *                 example: "https://example.com/thumbnail.jpg"
 *               coursematerial:
 *                 type: string
 *                 description: Basic programming concepts, syntax, and examples.
 *                 example: "Basic programming concepts, syntax, and examples."
 *               mainpoint:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Main points covered in the course.
 *                 example: ["Variables", "Loops", "Functions", "Data Structures"]
 *               coursereq:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Prerequisites for the course.
 *                 example: ["Basic Math", "Logical Thinking"]
 *               coursecrm:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     section:
 *                       type: object
 *                       properties:
 *                         sectionname:
 *                           type: string
 *                           description: Name of the section.
 *                           example: "Getting Started"
 *                         content:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               title:
 *                                 type: string
 *                               description:
 *                                 type: string
 *                               type:
 *                                 type: string
 *                                 enum: [video, text, pdf]
 *                               url:
 *                                 type: string
 *                               duration:
 *                                 type: integer
 *                                 description: Duration in minutes.
 *                           description: Content covered in this section.
 *                           example:
 *                             - title: "Introduction"
 *                               description: "Overview of the course and objectives"
 *                               type: "video"
 *                               url: "https://example.com/video1.mp4"
 *                               duration: 10
 *                             - title: "Setting Up Environment"
 *                               description: "Installing tools and setting up the environment"
 *                               type: "text"
 *                               url: "https://example.com/setup-guide.pdf"
 *                               duration: 15
 *               welmsg:
 *                 type: string
 *                 description: Welcome message for the course.
 *                 example: "Welcome to the course!"
 *               conmsg:
 *                 type: string
 *                 description: Completion message for the course.
 *                 example: "Congratulations on finishing the course!"
 *     security:
 *       - BearerAuth: []
 *       - RefreshToken: []
 *     responses:
 *       200:
 *         description: Successfully updated the course.
 *       400:
 *         description: Validation error or bad request (e.g., invalid data).
 *       403:
 *         description: Forbidden (e.g., user is not the creator of the course).
 *       404:
 *         description: Course not found.
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/courses/backoffice/{id}:
 *   delete:
 *     summary: Delete a course
 *     description: Teacher can delete a course by ID.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the course to delete
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *       - RefreshToken: []
 *     responses:
 *       200:
 *         description: Successfully deleted the course
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/courses/backoffice-cate:
 *   get:
 *     summary: Get course categories
 *     description: Retrieve available categories when creating a course.
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *       - RefreshToken: []
 *     responses:
 *       200:
 *         description: Successfully fetched categories
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/courses/backoffice-subcate/{id}:
 *   get:
 *     summary: Get subcategories by category ID
 *     description: Retrieve subcategories for a specific category ID when creating a course.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to fetch subcategories for
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *       - RefreshToken: []
 *     responses:
 *       200:
 *         description: Successfully fetched subcategories
 *       500:
 *         description: Internal server error
 */

