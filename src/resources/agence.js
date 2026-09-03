import { SendiAPIError } from '../errors.js';
// src/resources/agence.js
export class AgenceResource {
  constructor(client) {
    this.client = client;
  }

  /**
   * Récupère le solde de l'agence
   */
  async getSolde() {
    return this.client.get('/agence/solde');
  }

  /**
   * Récupère les courses de l'agence
   */
  async getCourses(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.limit) query.append('limit', params.limit);
    if (params.page) query.append('page', params.page);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    
    const endpoint = query.toString() ? `/agence/courses?${query}` : '/agence/courses';
    return this.client.get(endpoint);
  }

  /**
   * Met à jour le statut d'une course
   */
  async updateStatus(courseId, status, livreurId = null) {
    if (!courseId) {
      throw new SendiAPIError('ID de course requis', 400);
    }
    
    const validStatuses = ['assigned', 'in_progress', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new SendiAPIError(
        `Statut invalide. Utilisez: ${validStatuses.join(', ')}`,
        400
      );
    }

    return this.client.put(`/agence/courses/${courseId}/status`, { status, livreurId });
  }

  /**
   * Récupère les livreurs de l'agence
   */
  async getLivreurs(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.limit) query.append('limit', params.limit);
    
    const endpoint = query.toString() ? `/agence/livreurs?${query}` : '/agence/livreurs';
    return this.client.get(endpoint);
  }

  /**
   * Ajoute un livreur
   */
  async addLivreur(data) {
    const required = ['name', 'phone'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new SendiAPIError(
        `Champs requis manquants: ${missing.join(', ')}`,
        400
      );
    }

    return this.client.post('/agence/livreurs', data);
  }

  /**
   * Supprime un livreur
   */
  async removeLivreur(livreurId) {
    if (!livreurId) {
      throw new SendiAPIError('ID de livreur requis', 400);
    }
    return this.client.delete(`/agence/livreurs/${livreurId}`);
  }

  /**
   * Met à jour un livreur
   */
  async updateLivreur(livreurId, data) {
    if (!livreurId) {
      throw new SendiAPIError('ID de livreur requis', 400);
    }
    return this.client.put(`/agence/livreurs/${livreurId}`, data);
  }

  /**
   * Récupère les statistiques de l'agence
   */
  async getStats() {
    return this.client.get('/agence/stats');
  }

  /**
   * Récupère les notifications de l'agence
   */
  async getNotifications(params = {}) {
    const query = new URLSearchParams();
    if (params.limit) query.append('limit', params.limit);
    if (params.unreadOnly) query.append('unreadOnly', 'true');
    
    const endpoint = query.toString() ? `/agence/notifications?${query}` : '/agence/notifications';
    return this.client.get(endpoint);
  }

  /**
   * Marque une notification comme lue
   */
  async markNotificationAsRead(notificationId) {
    if (!notificationId) {
      throw new SendiAPIError('ID de notification requis', 400);
    }
    return this.client.post(`/agence/notifications/${notificationId}/read`);
  }
}