/**
 * @swagger
 * tags:
 *   name: Files
 *   description: File management API
 */

/**
 * @swagger
 * /api/uploads:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: string
 *                 format: binary
 *                 description: File to be uploaded
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/download/{id}:
 *   get:
 *     summary: Download a file by ID
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID to download
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             description: Suggests a filename for the file being downloaded
 *             schema:
 *               type: string
 *               example: 'attachment; filename="filename.pdf"'
 *       400:
 *         description: Invalid request
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
