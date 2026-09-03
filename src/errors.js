// src/errors.js
export class SendiAPIError extends Error {
  constructor(message, statusCode = 500, data = null) {
    super(message);
    this.name = 'SendiAPIError';
    this.statusCode = statusCode;
    this.data = data;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SendiAPIError);
    }
  }

  isValidationError() {
    return this.statusCode === 400;
  }

  isAuthError() {
    return this.statusCode === 401;
  }

  isCreditError() {
    return this.statusCode === 402;
  }

  isRateLimitError() {
    return this.statusCode === 429;
  }

  isServerError() {
    return this.statusCode >= 500;
  }

  isNetworkError() {
    return this.statusCode === 0;
  }

  getErrorMessage() {
    const messages = {
      400: 'Requête invalide - Vérifie les données envoyées',
      401: 'Non authentifié - Vérifie ta clé API',
      402: 'Crédits insuffisants - Recharge ton compte',
      403: 'Accès interdit - Vérifie tes permissions',
      404: 'Ressource non trouvée',
      429: 'Trop de requêtes - Attends un moment',
      500: 'Erreur serveur - Réessaie plus tard',
      503: 'Service indisponible - Réessaie plus tard'
    };
    return messages[this.statusCode] || this.message;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      data: this.data
    };
  }
}

export const ErrorMessages = {
  INVALID_API_KEY: 'Clé API invalide',
  MISSING_API_KEY: 'Clé API manquante',
  INVALID_REQUEST: 'Requête invalide',
  NETWORK_ERROR: 'Erreur réseau',
  TIMEOUT: 'Délai d\'attente dépassé',
  NOT_FOUND: 'Ressource non trouvée',
  UNAUTHORIZED: 'Non autorisé',
  FORBIDDEN: 'Accès interdit',
  RATE_LIMIT: 'Limite de requêtes atteinte',
  SERVER_ERROR: 'Erreur serveur',
  CREDIT_ERROR: 'Crédits insuffisants'
};

export const createError = (message, statusCode = 500, data = null) => {
  return new SendiAPIError(message, statusCode, data);
};