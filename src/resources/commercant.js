import { SendiAPIError } from '../errors.js';
// src/resources/commercant.js
export class CommercantResource {
  constructor(client) {
    this.client = client;
  }

  /**
   * Récupère les crédits
   */
  async getCredits() {
    return this.client.get('/commercant/credits');
  }

  /**
   * Recharge les crédits
   */
  async recharge(amount, paymentMethod = 'mobile_money') {
    if (!amount || amount <= 0) {
      throw new SendiAPIError('Montant invalide', 400);
    }
    return this.client.post('/commercant/recharge', { amount, paymentMethod });
  }

  /**
   * Récupère la clé API
   */
  async getApiKey() {
    return this.client.get('/commercant/apikey');
  }

  /**
   * Régénère la clé API
   */
  async regenerateApiKey() {
    return this.client.post('/commercant/apikey/regenerate');
  }

  /**
   * Récupère les statistiques
   */
  async getStats() {
    return this.client.get('/commercant/statistiques');
  }

  /**
   * Récupère les commandes
   */
  async getOrders(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.limit) query.append('limit', params.limit);
    if (params.page) query.append('page', params.page);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    
    const endpoint = query.toString() ? `/commercant/orders?${query}` : '/commercant/orders';
    return this.client.get(endpoint);
  }

  /**
   * Récupère le profil
   */
  async getProfile() {
    return this.client.get('/commercant/me');
  }

  /**
   * Récupère la configuration de livraison
   */
  async getDeliveryConfig() {
    return this.client.get('/commercant/delivery-config');
  }

  /**
   * Met à jour la configuration de livraison
   */
  async updateDeliveryConfig(config) {
    const validModes = ['client_pays', 'merchant_pays', 'threshold'];
    if (config.deliveryMode && !validModes.includes(config.deliveryMode)) {
      throw new SendiAPIError(
        `Mode de livraison invalide. Utilisez: ${validModes.join(', ')}`,
        400
      );
    }
    return this.client.put('/commercant/delivery-config', config);
  }

  /**
   * Récupère les pays disponibles
   */
  async getCountries() {
    return this.client.get('/commercant/countries');
  }

  /**
   * Récupère les communes par pays
   */
  async getCommunesByCountry(countryCode) {
    if (!countryCode || countryCode.length !== 2) {
      throw new SendiAPIError('Code pays invalide', 400);
    }
    return this.client.get(`/communes?country=${countryCode}`);
  }

  /**
   * Récupère l'historique des transactions
   */
  async getTransactions(params = {}) {
    const query = new URLSearchParams();
    if (params.limit) query.append('limit', params.limit);
    if (params.page) query.append('page', params.page);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    
    const endpoint = query.toString() ? `/commercant/transactions?${query}` : '/commercant/transactions';
    return this.client.get(endpoint);
  }

  /**
   * Récupère les notifications
   */
  async getNotifications(params = {}) {
    const query = new URLSearchParams();
    if (params.limit) query.append('limit', params.limit);
    if (params.unreadOnly) query.append('unreadOnly', 'true');
    
    const endpoint = query.toString() ? `/commercant/notifications?${query}` : '/commercant/notifications';
    return this.client.get(endpoint);
  }

  /**
   * Marque une notification comme lue
   */
  async markNotificationAsRead(notificationId) {
    if (!notificationId) {
      throw new SendiAPIError('ID de notification requis', 400);
    }
    return this.client.post(`/commercant/notifications/${notificationId}/read`);
  }
}