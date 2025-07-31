/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get user details
 *     description: Retrieve user details for the currently logged-in user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - RefreshToken: []
 *     responses:
 *       200:
 *         description: A user object with details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67cc2dabbfb5f0e97ccb063e"
 *                     firstname:
 *                       type: string
 *                       example: "Parintorn"
 *                     lastname:
 *                       type: string
 *                       example: "Yaimai"
 *                     welcomeMessage:
 *                       type: string
 *                       example: "Welcome!"
 *                     language:
 *                       type: string
 *                       example: "th"
 *                     dateFormat:
 *                       type: string
 *                       example: "YYYY-MM-DD"
 *                     timeFormat:
 *                       type: string
 *                       example: "24-hour"
 *                     country:
 *                       type: string
 *                       example: "TH"
 *                     timeZone:
 *                       type: string
 *                       example: "UTC"
 *                     currentTime:
 *                       type: string
 *                       example: "default-time"
 *                     email:
 *                       type: string
 *                       example: "guy18042003@gmail.com"
 *                     role:
 *                       type: string
 *                       example: "student"
 *                     comments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           commentId:
 *                             type: string
 *                             example: "123"
 *                           content:
 *                             type: string
 *                             example: "Great job!"
 *                     assignments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           assignmentId:
 *                             type: string
 *                             example: "456"
 *                           title:
 *                             type: string
 *                             example: "Math Assignment"
 *                     profilepicture:
 *                       type: string
 *                       example: null
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-08T11:44:43.326Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-08T12:55:52.818Z"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/update:
 *   patch:
 *     summary: Update user details
 *     description: Update the information of the currently logged-in user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - RefreshToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: "John"
 *               lastname:
 *                 type: string
 *                 example: "Doe"
 *               welcomeMessage:
 *                 type: string
 *                 example: "Welcome to our system!"
 *               language:
 *                 type: string
 *                 example: "en"
 *               dateFormat:
 *                 type: string
 *                 example: "YYYY-MM-DD"
 *               timeFormat:
 *                 type: string
 *                 example: "HH:mm:ss"
 *               country:
 *                 type: string
 *                 example: "US"
 *               timeZone:
 *                 type: string
 *                 example: "UTC-5"
 *               currentTime:
 *                 type: string
 *                 example: "2025-03-12T14:00:00Z"
 *     responses:
 *       200:
 *         description: Successfully updated user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *       400:
 *         description: Invalid data provided.
 *       401:
 *         description: Unauthorized request.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/delete:
 *   delete:
 *     summary: Delete user
 *     description: Delete the currently logged-in user account.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - RefreshToken: []
 *     responses:
 *       200:
 *         description: Successfully deleted user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error
 */
