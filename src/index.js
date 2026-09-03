// src/index.js
import { SendiClient } from './client.js';
import { SendiAPIError } from './errors.js';
import { OrdersResource } from './resources/orders.js';
import { CommercantResource } from './resources/commercant.js';
import { AgenceResource } from './resources/agence.js';
import { DeliveryResource } from './resources/delivery.js';
import { StatsResource } from './resources/stats.js';
import { WebhookResource } from './resources/webhook.js';

/**
 * Client principal de l'API Sendi
 */
class SendiAPI {
  constructor(apiKey, config = {}) {
    if (!apiKey) {
      throw new SendiAPIError(
        'Clé API requise. Obtenez votre clé sur https://sendi.com/dashboard',
        401
      );
    }

    this.client = new SendiClient({
      apiKey,
      baseURL: config.baseURL || 'https://api.sendi-api.com/api/v1',
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
      headers: config.headers || {}
    });

    // Initialisation des ressources
    this.orders = new OrdersResource(this.client);
    this.commercant = new CommercantResource(this.client);
    this.agence = new AgenceResource(this.client);
    this.delivery = new DeliveryResource(this.client);
    this.stats = new StatsResource(this.client);
    this.webhook = new WebhookResource(this.client);
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
  async getCommunes(params = {}) {
    return this.delivery.getCommunes(params);
  }

  /**
   * Récupère la configuration de livraison
   */
  async getDeliveryConfig() {
    return this.delivery.getConfig();
  }

  /**
   * Calcule le prix de livraison
   */
  async calculatePrice(pickupCommune, clientCommune, options = {}) {
    return this.delivery.calculatePrice(pickupCommune, clientCommune, options);
  }

  /**
   * Vérifie la disponibilité d'une livraison
   */
  async checkAvailability(pickupCommune, clientCommune) {
    return this.delivery.checkAvailability(pickupCommune, clientCommune);
  }

  /**
   * Récupère les agences disponibles
   */
  async getAvailableAgences(commune, options = {}) {
    return this.delivery.getAvailableAgences(commune, options);
  }
}

// Export des classes et utilitaires
export {
  SendiAPI,
  SendiClient,
  SendiAPIError,
  OrdersResource,
  CommercantResource,
  AgenceResource,
  DeliveryResource,
  StatsResource,
  WebhookResource
};

// Export par défaut
export default SendiAPI;