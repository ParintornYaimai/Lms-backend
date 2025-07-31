/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Operations related to feedback
 */

// Get all feedback for a given user

/**
 * @swagger
 * /api/feedback/{id}:
 *   get:
 *     summary: Get all feedback for a given user
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to fetch feedback for
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of feedback for the user
 *       403:
 *         description: Forbidden (if user is not a student)
 *       500:
 *         description: Internal server error
 */

// Create new feedback

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Create new feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: The ID of the course being rated
 *                 example: "678f4fa481ce4b4fd2a606fb"
 *               rating:
 *                 type: integer
 *                 description: The rating given to the course (1 to 5)
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               text:
 *                 type: string
 *                 description: A text feedback for the course
 *                 example: "Good"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *       400:
 *         description: Bad request (if validation fails)
 *       500:
 *         description: Internal server error
 */

// Update feedback

/**
 * @swagger
 * /api/feedback:
 *   patch:
 *     summary: Update existing feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: The ID of the course being rated
 *                 example: "678f4fa481ce4b4fd2a606fb"
 *               feedbackId:
 *                 type: string
 *                 description: The ID of the feedback being updated
 *                 example: "678f50ca031ce23255f3dde6"
 *               rating:
 *                 type: integer
 *                 description: The rating given to the course (1 to 5)
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 1
 *               text:
 *                 type: string
 *                 description: Updated text feedback for the course
 *                 example: "Very bad"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *       400:
 *         description: Bad request (if validation fails)
 *       500:
 *         description: Internal server error
 */

// Delete feedback

/**
 * @swagger
 * /api/feedback:
 *   delete:
 *     summary: Delete feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: The ID of the course to which the feedback belongs
 *                 example: "678f4fa481ce4b4fd2a606fb"
 *               feedbackId:
 *                 type: string
 *                 description: The ID of the feedback to be deleted
 *                 example: "678f56b8ab13d2b169d907a4"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *       400:
 *         description: Bad request (if validation fails)
 *       404:
 *         description: Feedback not found
 *       500:
 *         description: Internal server error
 */


