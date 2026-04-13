/**
 * @swagger
 * components:
 *   schemas:
 *     EventCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "ea90cb52-97af-47ab-914f-ad6d2f06a4fe"
 *         name:
 *           type: string
 *           example: "Concert"
 *         links:
 *           type: object
 *           properties:
 *             self:
 *               type: string
 *               example: "/api/v1/event-categories/ea90cb52-97af-47ab-914f-ad6d2f06a4fe"
 *     EventCategoryLinks:
 *       type: object
 *       properties:
 *         self:
 *           type: string
 *           example: "/api/v1/event-categories/ea90cb52-97af-47ab-914f-ad6d2f06a4fe"
 */
