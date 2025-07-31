
/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Operations related to assignments
 */

// Student routes
/**
 * @swagger
 * /api/assignments:
 *   get:
 *     summary: Get all assignment submissions by student
 *     tags: [Assignments]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of assignment submissions
 *       403:
 *         description: Forbidden (if user is not a student)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/assignments:
 *   post:
 *     summary: Create assignment submission by student
 *     tags: [Assignments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: The ID of the course associated with the assignment
 *               assignmentId:
 *                 type: string
 *                 description: The ID of the specific assignment to be submitted
 *               files:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       format: uri
 *                       description: The URL where the assignment file is located
 *                     type:
 *                       type: string
 *                       description: The type of the file (e.g., pdf, docx)
 *                     size:
 *                       type: integer
 *                       description: The size of the file in bytes
 *             required:
 *               - courseId
 *               - assignmentId
 *               - files
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Assignment submission created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */


// Teacher routes
/**
 * @swagger
 * /api/assignments/backoffice:
 *   get:
 *     summary: Get all assignments by teacher
 *     tags: [Assignments]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of assignments created by the teacher
 *       403:
 *         description: Forbidden (if user is not a teacher)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/assignments/backoffice:
 *   post:
 *     summary: Create an assignment by teacher
 *     tags: [Assignments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the assignment
 *                 example: "Assignment 1"
 *               courseId:
 *                 type: string
 *                 description: ID of the course this assignment is related to
 *                 example: "678f4fa481ce4b4fd2a606fb"
 *               passpercen:
 *                 type: integer
 *                 description: Percentage required to pass the assignment
 *                 example: 85
 *               date:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     format: date-time
 *                     description: The start date of the assignment
 *                     example: "2025-04-01T00:00:00Z"
 *                   end:
 *                     type: string
 *                     format: date-time
 *                     description: The end date of the assignment
 *                     example: "2025-04-30T23:59:59Z"
 *               files:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       format: uri
 *                       description: URL of the assignment file
 *                       example: "https://example.com/assignment2.pdf"
 *                     name:
 *                       type: string
 *                       description: Name of the file
 *                       example: "Assignment 2 Updated"
 *                     type:
 *                       type: string
 *                       description: Type of the file (e.g., pdf, docx)
 *                       example: "pdf"
 *                     size:
 *                       type: integer
 *                       description: Size of the file in bytes
 *                       example: 2000
 *               totalmark:
 *                 type: integer
 *                 description: Total marks for the assignment
 *                 example: 75
 *             required:
 *               - title
 *               - courseId
 *               - passpercen
 *               - date
 *               - files
 *               - totalmark
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/assignments/backoffice/{id}:
 *   patch:
 *     summary: Update an assignment by teacher
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The assignment ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the assignment
 *                 example: "Assignment 1 Updated"
 *               courseId:
 *                 type: string
 *                 description: ID of the course this assignment is related to
 *                 example: "678f4fa481ce4b4fd2a606fb"
 *               passpercen:
 *                 type: integer
 *                 description: Percentage required to pass the assignment
 *                 example: 85
 *               date:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     format: date-time
 *                     description: The start date of the assignment
 *                     example: "2025-04-01T00:00:00Z"
 *                   end:
 *                     type: string
 *                     format: date-time
 *                     description: The end date of the assignment
 *                     example: "2025-04-30T23:59:59Z"
 *               files:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       format: uri
 *                       description: URL of the assignment file
 *                       example: "https://example.com/assignment2.pdf"
 *                     name:
 *                       type: string
 *                       description: Name of the file
 *                       example: "Assignment 2 Updated"
 *                     type:
 *                       type: string
 *                       description: Type of the file (e.g., pdf, docx)
 *                       example: "pdf"
 *                     size:
 *                       type: integer
 *                       description: Size of the file in bytes
 *                       example: 2000
 *               totalmark:
 *                 type: integer
 *                 description: Total marks for the assignment
 *                 example: 75
 *               status:
 *                 type: string
 *                 description: Status of the assignment (e.g., Overdue)
 *                 example: "Overdue"
 *             required:
 *               - title
 *               - courseId
 *               - passpercen
 *               - date
 *               - files
 *               - totalmark
 *               - status
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Assignment updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /api/assignments/backoffice/{id}:
 *   delete:
 *     summary: Delete an assignment by teacher
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The assignment ID to delete
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 */

// Score routes
/**
 * @swagger
 * /api/assignments/backoffice/result/{id}:
 *   get:
 *     summary: Get assignment results by teacher
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The assignment ID to fetch results for
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Results of the assignment
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/assignments/backoffice:
 *   patch:
 *     summary: Update scores for an assignment by teacher
 *     tags: [Assignments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignmentId:
 *                 type: string
 *                 description: The ID of the assignment
 *                 example: "67d2d684d0f53648b3db974d"
 *               scores:  
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     studentId:
 *                       type: string
 *                       description: The ID of the student
 *                       example: "67d1f9edfadd7e0e0ef68231"
 *                     score:
 *                       type: number
 *                       description: The score given to the student
 *                       example: 85
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Scores updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 */
