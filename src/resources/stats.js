// src/resources/stats.js
/**
 * Ressource de gestion des statistiques
 */
export class StatsResource {
  constructor(client) {
    this.client = client;
  }

  /**
   * Statistiques du commerçant
   * Correspond à: les stats dans le dashboard WordPress
   */
  async getMerchantStats() {
    return this.client.get('/stats/merchant');
  }

  /**
   * Statistiques des commandes
   */
  async getOrdersStats(params = {}) {
    const query = new URLSearchParams();
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    if (params.status) query.append('status', params.status);
    if (params.groupBy) query.append('groupBy', params.groupBy);
    const endpoint = query.toString() ? `/stats/orders?${query}` : '/stats/orders';
    return this.client.get(endpoint);
  }

  /**
   * Statistiques de livraison
   */
  async getDeliveryStats() {
    return this.client.get('/stats/delivery');
  }

  /**
   * Top des agences
   */
  async getTopAgences(limit = 10) {
    return this.client.get(`/stats/top-agences?limit=${limit}`);
  }

  /**
   * Performance globale
   */
  async getPerformance() {
    return this.client.get('/stats/performance');
  }

  /**
   * Statistiques de revenus
   */
  async getRevenueStats(params = {}) {
    const query = new URLSearchParams();
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    if (params.period) query.append('period', params.period);
    const endpoint = query.toString() ? `/stats/revenue?${query}` : '/stats/revenue';
    return this.client.get(endpoint);
  }

  /**
   * Statistiques des livraisons par commune
   */
  async getCommuneStats() {
    return this.client.get('/stats/communes');
  }
}