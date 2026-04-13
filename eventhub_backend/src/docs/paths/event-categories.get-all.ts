/**
 * @swagger
 * /event-categories:
 *   get:
 *     summary: Obtenir toutes les catégories d'événements
 *     description: Récupère la liste de toutes les catégories d'événements disponibles
 *     tags:
 *       - Event Categories
 *     responses:
 *       200:
 *         description: Liste des catégories d'événements
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
 *                     $ref: '#/components/schemas/EventCategory'
 *                 error:
 *                   nullable: true
 *                   type: object
 */
