export const ERROR_MESSAGES = {
  // Événements
  EVENT_NOT_FOUND: "Événement non trouvé",
  EVENT_ID_REQUIRED: "L'identifiant de l'événement est requis",
  EVENT_TITLE_REQUIRED: "Le titre est requis",
  EVENT_START_DATE_MUST_BE_FUTURE: "La date de début doit être dans le futur",
  EVENT_END_DATE_MUST_BE_AFTER_START:
    "La date de fin doit être après la date de début",
  EVENT_LOCATION_REQUIRED: "Le lieu est requis",
  EVENT_MAX_CAPACITY_INVALID: "La capacité maximale doit être d'au moins 1",
  EVENT_AVAILABLE_TICKETS_EXCEED_CAPACITY:
    "Les billets disponibles ne peuvent pas dépasser la capacité maximale",
  EVENT_PRICE_MUST_BE_POSITIVE: "Le prix doit être positif",
  EVENT_CAN_ONLY_UPDATE_OWN:
    "Vous ne pouvez modifier que vos propres événements",
  EVENT_CAN_ONLY_DELETE_OWN:
    "Vous ne pouvez supprimer que vos propres événements",
  EVENT_CREATED_SUCCESS: "Événement créé avec succès",
  EVENT_UPDATED_SUCCESS: "Événement mis à jour avec succès",
  EVENT_DELETED_SUCCESS: "Événement supprimé avec succès",

  // Catégories d'événements
  EVENT_CATEGORY_NOT_FOUND: "Catégorie d'événement non trouvée",
  EVENT_CATEGORY_ID_REQUIRED:
    "L'identifiant de la catégorie d'événement est requis",
  EVENT_CATEGORY_NAME_REQUIRED: "Le nom de la catégorie d'événement est requis",
  EVENT_CATEGORY_ID_REQUIRED_VALUE_OBJECT:
    "L'identifiant de la catégorie d'événement est requis",

  // Utilisateurs
  USER_NOT_AUTHENTICATED: "Utilisateur non authentifié",
  USER_ALREADY_EXISTS: "Un utilisateur existe déjà avec cet email",
  INVALID_CREDENTIALS: "Identifiants invalides",

  // Authentification
  MISSING_AUTHORIZATION_HEADER: "En-tête d'autorisation manquant",
  INVALID_AUTHORIZATION_HEADER: "En-tête d'autorisation invalide",

  // Système
  INTERNAL_SERVER_ERROR: "Erreur interne du serveur",
  ENVIRONMENT_VARIABLE_NOT_SET: (variableName: string) =>
    `La variable d'environnement ${variableName} n'est pas définie`,
} as const;
