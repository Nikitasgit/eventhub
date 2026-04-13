/**
 * @swagger
 * /events/{id}:
 *   patch:
 *     summary: Mettre à jour un événement
 *     description: Permet à l'organisateur d'un événement de le mettre à jour
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de l'événement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEventInput'
 *     responses:
 *       200:
 *         description: Événement mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Vous ne pouvez modifier que vos propres événements
 *       404:
 *         description: Événement ou catégorie d'événement non trouvé
 *       400:
 *         description: Données de requête invalides
 */
