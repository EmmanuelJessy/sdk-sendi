// src/resources/webhook.js
/**
 * Ressource de gestion des webhooks
 */
export class WebhookResource {
  constructor(client) {
    this.client = client;
  }

  /**
   * Récupérer la liste des webhooks
   */
  async list() {
    return this.client.get('/webhooks');
  }

  /**
   * Créer un webhook
   */
  async create(data) {
    const webhookData = {
      url: data.url,
      events: data.events || ['order.created', 'order.updated', 'order.delivered'],
      secret: data.secret || this.generateSecret(),
      enabled: data.enabled !== undefined ? data.enabled : true,
      description: data.description || ''
    };
    return this.client.post('/webhooks', webhookData);
  }

  /**
   * Mettre à jour un webhook
   */
  async update(id, data) {
    return this.client.put(`/webhooks/${id}`, data);
  }

  /**
   * Supprimer un webhook
   */
  async delete(id) {
    return this.client.delete(`/webhooks/${id}`);
  }

  /**
   * Tester un webhook
   */
  async test(id) {
    return this.client.post(`/webhooks/${id}/test`);
  }

  /**
   * Récupérer les événements disponibles
   */
  async getEvents() {
    return {
      events: [
        { id: 'order.created', label: 'Commande créée' },
        { id: 'order.updated', label: 'Commande mise à jour' },
        { id: 'order.delivered', label: 'Commande livrée' },
        { id: 'order.cancelled', label: 'Commande annulée' },
        { id: 'order.failed', label: 'Commande échouée' },
        { id: 'order.assigned', label: 'Commande assignée à une agence' },
        { id: 'order.in_progress', label: 'Commande en cours' }
      ]
    };
  }

  /**
   * Générer un secret aléatoire
   */
  generateSecret() {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }
}