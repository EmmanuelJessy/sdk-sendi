// src/client.js
import axios from 'axios';
import { SendiAPIError } from './errors.js';

export class SendiClient {
  constructor(config = {}) {
    if (!config.apiKey) {
      throw new SendiAPIError('Clé API requise. Obtenez votre clé sur https://sendi-api.com/dashboard', 401);
    }

    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || 'https://api.sendi-api.com/api/v1';
    this.timeout = config.timeout || 30000;
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
    this.headers = config.headers || {};
  }

  _getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'User-Agent': 'SendiAPI-SDK/2.0.0',
      'Accept': 'application/json',
      ...this.headers
    };
  }

  async _retryRequest(fn, retries = this.maxRetries) {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0 && error.statusCode >= 500) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this._retryRequest(fn, retries - 1);
      }
      throw error;
    }
  }

  async request(method, endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this._getHeaders();

    return this._retryRequest(async () => {
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
        throw new SendiAPIError(error.message || 'Erreur réseau', 0);
      }
    });
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

  patch(endpoint, data = {}, options = {}) {
    return this.request('PATCH', endpoint, { ...options, body: data });
  }
}