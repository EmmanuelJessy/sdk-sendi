import { SendiAPIError } from '../errors.js';
// src/resources/delivery.js
/**
 * Ressource de gestion des livraisons
 * Correspond aux fonctionnalités du plugin WordPress SendiAPI
 */
export class DeliveryResource {
  constructor(client) {
    this.client = client;
  }

  /**
   * Récupérer la configuration de livraison du commerçant
   * Correspond à: get_option('livraison_api_*') dans WordPress
   */
  async getConfig() {
    return this.client.get('/delivery/config');
  }

  /**
   * Mettre à jour la configuration de livraison
   * Correspond à: update_option('livraison_api_*') dans WordPress
   */
  async updateConfig(config) {
    return this.client.put('/delivery/config', config);
  }

  /**
   * Récupérer les communes
   * Correspond à: get_communes() dans WordPress
   */
  async getCommunes(params = {}) {
    const query = new URLSearchParams();
    if (params.country) query.append('country', params.country);
    if (params.search) query.append('search', params.search);
    if (params.limit) query.append('limit', params.limit);
    const endpoint = query.toString() ? `/communes?${query}` : '/communes';
    return this.client.get(endpoint);
  }

  /**
   * Récupérer les pays autorisés
   * Correspond à: get_option('livraison_api_allowed_countries') dans WordPress
   */
  async getCountries() {
    return this.client.get('/delivery/countries');
  }

  /**
   * Calculer le prix de livraison
   * Correspond à: la logique de calcul de prix dans le plugin
   */
  async calculatePrice(pickupCommune, clientCommune, options = {}) {
    const params = new URLSearchParams({
      pickupCommune,
      clientCommune,
      deliveryMode: options.deliveryMode || 'client_pays',
      freeThreshold: options.freeThreshold || 0,
      orderTotal: options.orderTotal || 0,
      currency: options.currency || 'FCFA'
    });
    return this.client.get(`/delivery/price?${params}`);
  }

  /**
   * Vérifier la disponibilité d'une livraison
   */
  async checkAvailability(pickupCommune, clientCommune) {
    const params = new URLSearchParams({
      pickup: pickupCommune,
      client: clientCommune
    });
    return this.client.get(`/delivery/availability?${params}`);
  }

  /**
   * Récupérer les agences disponibles
   * Correspond à: get_available_agences() dans WordPress
   */
  async getAvailableAgences(commune, options = {}) {
    const params = new URLSearchParams({ commune });
    if (options.pickupCommune) params.append('pickupCommune', options.pickupCommune);
    if (options.clientCommune) params.append('clientCommune', options.clientCommune);
    if (options.limit) params.append('limit', options.limit);
    return this.client.get(`/delivery/agences?${params}`);
  }

  /**
   * Récupérer les modes de livraison disponibles
   * Correspond à: les options de livraison dans le plugin
   */
  async getDeliveryModes() {
    return {
      modes: [
        { id: 'client_pays', label: 'Client paie la livraison' },
        { id: 'merchant_pays', label: 'Commerçant paie la livraison (gratuit pour le client)' },
        { id: 'threshold', label: 'Gratuit à partir d\'un montant' }
      ]
    };
  }

  /**
   * Récupérer les devises disponibles
   */
  async getCurrencies() {
    return {
      currencies: [
        { code: 'FCFA', label: 'Franc CFA' },
        { code: 'XOF', label: 'Franc CFA (ISO)' },
        { code: 'EUR', label: 'Euro' },
        { code: 'USD', label: 'Dollar US' }
      ]
    };
  }
}