// src/index.js
import { SendiClient } from './client.js';
import { OrdersResource } from './resources/orders.js';
import { CommercantResource } from './resources/commercant.js';
import { AgenceResource } from './resources/agence.js';

class SendiAPI {
  constructor(apiKey, config = {}) {
    if (!apiKey) {
      throw new Error('Clé API requise. Obtenez votre clé sur https://sendi.com/dashboard');
    }

    this.client = new SendiClient({
      apiKey,
      baseURL: config.baseURL || 'http://localhost:5001/api/v1',
      timeout: config.timeout || 30000,
      ...config
    });

    this.orders = new OrdersResource(this.client);
    this.commercant = new CommercantResource(this.client);
    this.agence = new AgenceResource(this.client);
  }

  async health() {
    return this.client.get('/health');
  }

  async getCommunes() {
    return this.client.get('/communes');
  }
}

export default SendiAPI;
export { SendiAPI, SendiClient, OrdersResource, CommercantResource, AgenceResource };