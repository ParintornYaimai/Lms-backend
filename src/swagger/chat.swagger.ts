
/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: Operations related to chats
 */

// Get all friends (students)

/**
 * @swagger
 * /api/chats/getAllFriends:
 *   get:
 *     summary: Get all friends for the student
 *     tags: [Chats]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of friends
 *       403:
 *         description: Forbidden (if user is not a student)
 *       500:
 *         description: Internal server error
 */

// Get all chats for the owner account (students)

/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: Get all chats for the student's account
 *     tags: [Chats]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of chats
 *       403:
 *         description: Forbidden (if user is not a student)
 *       500:
 *         description: Internal server error
 */

// Create a chat with another user

/**
 * @swagger
 * /api/chats/createChat/{id}:
 *   post:
 *     summary: Create a new chat with another user
 *     tags: [Chats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to create a chat with
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Chat created successfully
 *       400:
 *         description: Bad request (if validation fails)
 *       500:
 *         description: Internal server error
 */

// Create a chat group

/**
 * @swagger
 * /api/chats/createChatGroup:
 *   post:
 *     summary: Create a new chat group
 *     tags: [Chats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               peopleId:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of people IDs to add to the chat group
 *                 example: 
 *                   - "675a7eb5149ff67a66c81a85"
 *                   - "675a8111149ff67a66c81aa9"
 *                   - "67b86be05e63cd011b2e46b9"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Chat group created successfully
 *       400:
 *         description: Bad request (if validation fails)
 *       500:
 *         description: Internal server error
 */


// Add member to chat group

/**
 * @swagger
 * /api/chats/addMember:
 *   patch:
 *     summary: Add a member to a chat group
 *     tags: [Chats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupChatId:
 *                 type: string
 *                 description: "ID of the chat group"
 *               peopleId:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "List of user IDs to be added to the chat group"
 *             required:
 *               - groupChatId
 *               - peopleId
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Member added successfully
 *       400:
 *         description: Bad request (if validation fails)
 *       404:
 *         description: Chat group not found
 *       500:
 *         description: Internal server error
 */

// Delete a chat
/**
 * @swagger
 * /api/chats/{id}:
 *   delete:
 *     summary: Delete a chat
 *     tags: [Chats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the chat to delete
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Chat deleted successfully
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Internal server error
 */


