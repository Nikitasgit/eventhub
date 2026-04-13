/**
 * @swagger
 * /events:
 *   get:
 *     summary: Obtenir tous les événements
 *     description: Retourne la liste de tous les événements triés par date de création
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: Liste des événements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
