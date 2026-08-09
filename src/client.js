
// src/client.js
import axios from 'axios';
import { SendiAPIError } from './errors.js';

export class SendiClient {
  constructor(config = {}) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || 'http://localhost:5001/api/v1';
    this.timeout = config.timeout || 30000;
    this.headers = config.headers || {};
  }

  _getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'User-Agent': 'SendiAPI-SDK/1.0.0',
      ...this.headers
    };
  }

  async request(method, endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this._getHeaders();

    try {
      const response = await axios({
        method,
        url,
        headers,
        data: options.body,
        params: options.params,
        timeout: this.timeout
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new SendiAPIError(
          error.response.data?.error || error.response.data?.message || 'Erreur API',
          error.response.status,
          error.response.data
        );
      }
      throw new SendiAPIError(error.message || 'Erreur réseau');
    }
  }

  get(endpoint, options = {}) {
    return this.request('GET', endpoint, options);
  }

  post(endpoint, data = {}, options = {}) {
    return this.request('POST', endpoint, { ...options, body: data });
  }

  put(endpoint, data = {}, options = {}) {
    return this.request('PUT', endpoint, { ...options, body: data });
  }

  delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, options);
  }
}