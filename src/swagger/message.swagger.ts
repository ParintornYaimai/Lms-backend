/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Operations related to messages
 */

// Get all messages

/**
 * @swagger
 * /api/messages/{id}:
 *   get:
 *     summary: Get all messages for a given user
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to fetch messages for
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of messages
 *       403:
 *         description: Forbidden (if user is not a student)
 *       500:
 *         description: Internal server error
 */

// Create a message


/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatroom:
 *                 type: string
 *                 description: "ID of the chatroom"
 *               receiver:
 *                 type: string
 *                 description: "ID of the receiver"
 *               messageText:
 *                 type: string
 *                 description: "Text of the message"
 *             required:
 *               - chatroom
 *               - receiver
 *               - messageText
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Bad request (if validation fails)
 *       500:
 *         description: Internal server error
 */

// Edit a message

/**
 * @swagger
 * /api/messages:
 *   patch:
 *     summary: Edit an existing message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageId:
 *                 type: string
 *                 description: "ID of the message to be edited"
 *               chatroom:
 *                 type: string
 *                 description: "ID of the chatroom"
 *               messageText:
 *                 type: string
 *                 description: "The text content of the message"
 *               actions:
 *                 type: string
 *                 description: "Action related to the message (e.g., 'good', 'bad')"
 *             required:
 *               - messageId
 *               - chatroom
 *               - messageText
 *               - actions
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Message edited successfully
 *       400:
 *         description: Bad request (if validation fails)
 *       500:
 *         description: Internal server error
 */

// Delete a message

/**
 * @swagger
 * /api/messages:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: "ID of the chatroom"
 *               messageId:
 *                 type: string
 *                 description: "ID of the message to be deleted"
 *             required:
 *               - chatId
 *               - messageId
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       400:
 *         description: Bad request (if validation fails)
 *       404:
 *         description: Message not found
 *       500:
 *         description: Internal server error
 */

