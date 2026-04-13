/**
 * @swagger
 * components:
 *   schemas:
 *     CreateEventInput:
 *       type: object
 *       required:
 *         - title
 *         - startDate
 *         - endDate
 *         - location
 *         - maxCapacity
 *         - availableTickets
 *         - categoryId
 *       properties:
 *         title:
 *           type: string
 *           example: "Concert de Rock"
 *         description:
 *           type: string
 *           example: "Un concert de rock avec plusieurs groupes locaux"
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2026-12-31T20:00:00.000Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2026-12-31T23:00:00.000Z"
 *         location:
 *           type: string
 *           example: "Salle de concert principale, 123 Rue de la Musique, Paris"
 *         maxCapacity:
 *           type: integer
 *           example: 500
 *         availableTickets:
 *           type: integer
 *           example: 450
 *         price:
 *           type: number
 *           example: 25.0
 *         categoryId:
 *           type: string
 *           format: uuid
 *           example: "ea90cb52-97af-47ab-914f-ad6d2f06a4fe"
 *     UpdateEventInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Concert de Rock"
 *         description:
 *           type: string
 *           example: "Un concert de rock avec plusieurs groupes locaux"
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2026-12-31T20:00:00.000Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2026-12-31T23:00:00.000Z"
 *         location:
 *           type: string
 *           example: "Salle de concert principale, 123 Rue de la Musique, Paris"
 *         maxCapacity:
 *           type: integer
 *           example: 500
 *         availableTickets:
 *           type: integer
 *           example: 450
 *         price:
 *           type: number
 *           example: 25.0
 *         categoryId:
 *           type: string
 *           format: uuid
 *           example: "ea90cb52-97af-47ab-914f-ad6d2f06a4fe"
 *     EventLinks:
 *       type: object
 *       properties:
 *         self:
 *           type: string
 *           example: "/api/v1/events/90ff484b-10b4-4e28-a853-fee2e8e76467"
 *         update:
 *           type: string
 *           example: "/api/v1/events/90ff484b-10b4-4e28-a853-fee2e8e76467"
 *         delete:
 *           type: string
 *           example: "/api/v1/events/90ff484b-10b4-4e28-a853-fee2e8e76467"
 *         organizer:
 *           type: string
 *           example: "/api/v1/users/123e4567-e89b-12d3-a456-426614174000"
 *         category:
 *           type: string
 *           example: "/api/v1/event-categories/ea90cb52-97af-47ab-914f-ad6d2f06a4fe"
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         location:
 *           type: string
 *         maxCapacity:
 *           type: integer
 *         availableTickets:
 *           type: integer
 *         price:
 *           type: number
 *           nullable: true
 *         categoryId:
 *           type: string
 *           format: uuid
 *         organizerId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         links:
 *           $ref: '#/components/schemas/EventLinks'
 */
