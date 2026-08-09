// src/resources/commercant.js
export class CommercantResource {
    constructor(client) {
      this.client = client;
    }
  
    async getCredits() {
      return this.client.get('/commercant/credits');
    }
  
    async recharge(amount, paymentMethod = 'mobile_money') {
      return this.client.post('/commercant/recharge', { amount, paymentMethod });
    }
  
    async getApiKey() {
      return this.client.get('/commercant/apikey');
    }
  
    async regenerateApiKey() {
      return this.client.post('/commercant/apikey/regenerate');
    }
  
    async getStats() {
      return this.client.get('/commercant/statistiques');
    }
  
    async getOrders(params = {}) {
      const query = new URLSearchParams();
      if (params.status) query.append('status', params.status);
      if (params.limit) query.append('limit', params.limit);
      if (params.page) query.append('page', params.page);
      const endpoint = query.toString() ? `/commercant/orders?${query}` : '/commercant/orders';
      return this.client.get(endpoint);
    }
  
    async getProfile() {
      return this.client.get('/commercant/me');
    }
  }