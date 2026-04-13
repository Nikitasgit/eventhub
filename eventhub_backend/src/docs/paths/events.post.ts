/**
 * @swagger
 * /events:
 *   post:
 *     summary: Créer un nouvel événement
 *     description: Permet à un utilisateur authentifié de créer un nouvel événement
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventInput'
 *     responses:
 *       201:
 *         description: Événement créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 message:
 *                   type: string
 *       401:
 *         description: Non authentifié
 *       400:
 *         description: Données de requête invalides
 *       404:
 *         description: Catégorie d'événement non trouvée
 */
