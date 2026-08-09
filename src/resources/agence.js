// src/resources/agence.js
export class AgenceResource {
    constructor(client) {
      this.client = client;
    }
  
    async getSolde() {
      return this.client.get('/agence/solde');
    }
  
    async getCourses(params = {}) {
      const query = new URLSearchParams();
      if (params.status) query.append('status', params.status);
      if (params.limit) query.append('limit', params.limit);
      if (params.page) query.append('page', params.page);
      const endpoint = query.toString() ? `/agence/courses?${query}` : '/agence/courses';
      return this.client.get(endpoint);
    }
  
    async updateStatus(courseId, status, livreurId = null) {
      return this.client.put(`/agence/courses/${courseId}/status`, { status, livreurId });
    }
  
    async getLivreurs() {
      return this.client.get('/agence/livreurs');
    }
  }