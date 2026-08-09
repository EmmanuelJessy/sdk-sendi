
// src/resources/orders.js
export class OrdersResource {
    constructor(client) {
      this.client = client;
    }
  
    async create(data) {
      return this.client.post('/order', data);
    }
  
    async get(id) {
      return this.client.get(`/order/${id}`);
    }
  
    async list(params = {}) {
      const query = new URLSearchParams();
      if (params.status) query.append('status', params.status);
      if (params.limit) query.append('limit', params.limit);
      if (params.page) query.append('page', params.page);
      const endpoint = query.toString() ? `/orders?${query}` : '/orders';
      return this.client.get(endpoint);
    }
  
    async cancel(id) {
      return this.client.post(`/order/${id}/cancel`);
    }
  
    async track(id) {
      return this.client.get(`/tracking/${id}`);
    }
  }