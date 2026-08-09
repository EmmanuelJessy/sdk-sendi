// sdk/src/index.js

import { SendiClient } from './client';
import { OrdersResource } from './resources/orders';
import { CommercantResource } from './resources/commercant';
import { AgenceResource } from './resources/agence';
import { SendiAPIError, ErrorMessages, createError } from './errors';

/**
 * Client principal de l'API Sendi
 */
class SendiAPI {
  constructor(apiKey, config = {}) {
    if (!apiKey) {
      throw new SendiAPIError('Clé API requise. Obtenez votre clé sur https://sendi.com/dashboard', 401);
    }

    this.client = new SendiClient({
      apiKey,
      ...config
    });

    // Initialisation des ressources
    this.orders = new OrdersResource(this.client);
    this.commercant = new CommercantResource(this.client);
    this.agence = new AgenceResource(this.client);
  }

  /**
   * Vérifie la santé de l'API
   */
  async health() {
    return this.client.get('/health');
  }

  /**
   * Récupère les communes disponibles
   */
  async getCommunes() {
    return this.client.get('/communes');
  }
}

// Export des classes et utilitaires
export {
  SendiAPI,
  SendiClient,
  SendiAPIError,
  ErrorMessages,
  createError,
  OrdersResource,
  CommercantResource,
  AgenceResource
};

// Export par défaut
export default SendiAPI;