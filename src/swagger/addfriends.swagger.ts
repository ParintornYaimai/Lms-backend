/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: Friend request management
 */

/**
 * @swagger
 * /api/friends/search:
 *   post:
 *     summary: Search for users by email
 *     tags: [Friends]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: "Email address of the user to search"
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Successfully searched for users
 *       400:
 *         description: Invalid parameters
 */

/**
 * @swagger
 * /api/friends/getAll:
 *   get:
 *     summary: Retrieve all friend requests
 *     tags: [Friends]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All friend requests retrieved successfully
 *       400:
 *         description: Error retrieving data
 */

/**
 * @swagger
 * /api/friends/sendReq:
 *   post:
 *     summary: Send a friend request
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromUserId:
 *                 type: string
 *                 description: "ID of the sender"
 *               toUserId:
 *                 type: string
 *                 description: "ID of the recipient"
 *     responses:
 *       201:
 *         description: Friend request sent successfully
 *       400:
 *         description: Invalid parameters
 */

/**
 * @swagger
 * /api/friends/acceptReq/{id}:
 *   patch:
 *     summary: Accept a friend request
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the friend request"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Friend request accepted successfully
 *       400:
 *         description: Error accepting the friend request
 */

/**
 * @swagger
 * /api/friends/cancleReq/{id}:
 *   delete:
 *     summary: Cancel a friend request
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the friend request"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Friend request canceled successfully
 *       400:
 *         description: Error canceling the friend request
 */
