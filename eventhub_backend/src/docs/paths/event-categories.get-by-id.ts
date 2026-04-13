/**
 * @swagger
 * /event-categories/{id}:
 *   get:
 *     summary: Obtenir une catégorie d'événement par son ID
 *     description: Récupère les détails d'une catégorie d'événement spécifique
 *     tags:
 *       - Event Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la catégorie d'événement
 *     responses:
 *       200:
 *         description: Catégorie d'événement trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/EventCategory'
 *                 error:
 *                   nullable: true
 *                   type: object
 *       404:
 *         description: Catégorie d'événement non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   nullable: true
 *                   type: object
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Event category not found"
 */
