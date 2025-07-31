/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: API for managing notes
 */

/**
 * @swagger
 * /api/note:
 *   get:
 *     summary: Get all notes
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *       - RefreshToken: []
 *     responses:
 *       200:
 *         description: List of all notes
 */

/**
 * @swagger
 * /api/note/{id}:
 *   get:
 *     summary: Get a note by ID
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *       - RefreshToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note data
 */

/**
 * @swagger
 * /api/note/myNote:
 *   get:
 *     summary: Get notes by account owner
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *       - RefreshToken: []
 *     responses:
 *       200:
 *         description: Notes for the authenticated user
 */

/**
 * @swagger
 * /api/note/filter:
 *   get:
 *     summary: Get notes by tag
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *       - RefreshToken: []
 *     parameters:
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         required: true
 *         description: Tag to filter notes  
 *     responses:
 *       200:
 *         description: Notes filtered by tag
 */

/**
 * @swagger
 * /api/note:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *       - RefreshToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               tag:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note created successfully
 */

/**
 * @swagger
 * /api/note:
 *   patch:
 *     summary: Update a note
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *       - RefreshToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               tag:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated successfully
 */

/**
 * @swagger
 * /api/note/{id}:
 *   delete:
 *     summary: Delete a note by ID
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *       - RefreshToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted successfully
 */
