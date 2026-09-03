// src/resources/orders.js
import { SendiAPIError } from '../errors.js';
import { validatePhone, isEmpty } from '../utils.js';

export class OrdersResource {
  constructor(client) {
    this.client = client;
  }

  /**
   * Valide les données de la commande
   */
  validateOrderData(data) {
    const required = [
      'clientName',
      'clientPhone',
      'clientAddress',
      'clientCommune',
      'pickupAddress',
      'pickupCommune'
    ];

    const missing = required.filter(field => !data[field] || data[field].trim() === '');

    if (missing.length > 0) {
      throw new SendiAPIError(
        `Champs requis manquants: ${missing.join(', ')}`,
        400
      );
    }

    // Validation du téléphone
    if (!validatePhone(data.clientPhone)) {
      throw new SendiAPIError(
        'Numéro de téléphone invalide. Format: +225XXXXXXXX',
        400
      );
    }

    // Validation du pays si présent
    if (data.clientCountry && data.clientCountry.length !== 2) {
      throw new SendiAPIError(
        'Code pays invalide. Utilisez un code ISO à 2 lettres (ex: CI)',
        400
      );
    }
  }

  /**
   * Crée une commande
   */
  async create(data) {
    this.validateOrderData(data);

    const orderData = {
      // Infos client
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      clientAddress: data.clientAddress,
      clientCommune: data.clientCommune,
      clientCountry: data.clientCountry || 'CI',

      // Infos pickup
      pickupAddress: data.pickupAddress,
      pickupCommune: data.pickupCommune,
      pickupCountry: data.pickupCountry || 'CI',

      // Infos commerçant
      merchantName: data.merchantName || '',
      merchantPhone: data.merchantPhone || '',
      merchantEmail: data.merchantEmail || '',
      merchantCountry: data.merchantCountry || 'CI',
      merchantCommune: data.merchantCommune || '',

      // Configuration livraison
      deliveryMode: data.deliveryMode || 'client_pays',
      freeThreshold: data.freeThreshold || 0,
      currency: data.currency || 'FCFA',

      // Inter-pays
      interCountryEnabled: data.interCountryEnabled || false,
      allowedCountries: data.allowedCountries || ['CI'],

      // Détails commande
      orderTotal: data.orderTotal || 0,
      packageWeight: data.packageWeight || 1,
      packageDescription: data.packageDescription || 'Colis',
      packageDimensions: data.packageDimensions || null,

      // Options
      instructions: data.instructions || '',
      preferredDate: data.preferredDate || null,
      preferredTime: data.preferredTime || null,
      isExpress: data.isExpress || false
    };

    return this.client.post('/order', orderData);
  }

  /**
   * Récupère une commande
   */
  async get(id) {
    if (!id) {
      throw new SendiAPIError('ID de commande requis', 400);
    }
    return this.client.get(`/order/${id}`);
  }

  /**
   * Liste les commandes avec filtres
   */
  async list(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.limit) query.append('limit', params.limit);
    if (params.page) query.append('page', params.page);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    if (params.search) query.append('search', params.search);
    if (params.commune) query.append('commune', params.commune);
    
    const endpoint = query.toString() ? `/orders?${query}` : '/orders';
    return this.client.get(endpoint);
  }

  /**
   * Annule une commande
   */
  async cancel(id, reason = '') {
    if (!id) {
      throw new SendiAPIError('ID de commande requis', 400);
    }
    return this.client.post(`/order/${id}/cancel`, { reason });
  }

  /**
   * Suit une commande
   */
  async track(id) {
    if (!id) {
      throw new SendiAPIError('ID de commande requis', 400);
    }
    return this.client.get(`/tracking/${id}`);
  }

  /**
   * Met à jour une commande
   */
  async update(id, data) {
    if (!id) {
      throw new SendiAPIError('ID de commande requis', 400);
    }
    return this.client.put(`/order/${id}`, data);
  }

  /**
   * Confirme la réception d'une commande
   */
  async confirmDelivery(id, codeSecret) {
    if (!id) {
      throw new SendiAPIError('ID de commande requis', 400);
    }
    if (!codeSecret) {
      throw new SendiAPIError('Code secret requis', 400);
    }
    return this.client.post(`/order/${id}/confirm`, { codeSecret });
  }

  /**
   * Calcule le prix avant création
   */
  async calculatePrice(pickupCommune, clientCommune, options = {}) {
    if (!pickupCommune || !clientCommune) {
      throw new SendiAPIError('Communes requises', 400);
    }

    const params = new URLSearchParams({
      pickupCommune,
      clientCommune,
      deliveryMode: options.deliveryMode || 'client_pays',
      freeThreshold: options.freeThreshold || 0,
      orderTotal: options.orderTotal || 0
    });
    return this.client.get(`/order/price?${params}`);
  }
}