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
  }

  /**
   * Crée une commande
   * 
   * ✅ Envoie les champs que ton backend attend (createOrder dans publicController.js)
   * et laisse le backend calculer le prix selon l'agence.
   */
  async create(data) {
    this.validateOrderData(data);

    const orderData = {
      // ✅ Infos client (obligatoires)
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      clientAddress: data.clientAddress,
      clientCommune: data.clientCommune,

      // ✅ Infos pickup (obligatoires)
      pickupAddress: data.pickupAddress,
      pickupCommune: data.pickupCommune,

      // ✅ Infos commerçant (phonecommercant est obligatoire côté backend)
      phonecommercant: data.merchantPhone || data.phonecommercant || '',
      merchantName: data.merchantName || '',
      merchantPhone: data.merchantPhone || data.phonecommercant || '',
      merchantEmail: data.merchantEmail || '',

      // ✅ Type de payeur (IMPORTANT pour le dispatch)
      payerType: data.payerType || 'client',  // 'client' | 'commercant'
      isFreeDelivery: data.isFreeDelivery || false,
      freeDeliveryReason: data.freeDeliveryReason || 'none',

      // ✅ Détails de la commande
      items: data.items || [],

      // ✅ Optionnel: forcer une agence spécifique
      agenceId: data.agenceId || null,
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
   * Suit une commande
   */
  async track(id) {
    if (!id) {
      throw new SendiAPIError('ID de commande requis', 400);
    }
    return this.client.get(`/tracking/${id}`);
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
   * Liste les commandes du commerçant
   */
  async list(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.limit) query.append('limit', params.limit);
    if (params.page) query.append('page', params.page);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    
    const endpoint = query.toString() 
      ? `/commercant/orders?${query}` 
      : '/commercant/orders';
    return this.client.get(endpoint);
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
   * Calcule le prix AVANT création
   * 
   * ⚠️ Utilise /agences/available (comme le plugin) 
   * via delivery.calculatePrice()
   */
  async calculatePrice(pickupCommune, clientCommune, options = {}) {
    if (!pickupCommune || !clientCommune) {
      throw new SendiAPIError('Communes requises', 400);
    }

    // ✅ Déléguer à delivery.calculatePrice() qui utilise /agences/available
    const response = await this.client.get(
      `/agences/available?commune=${encodeURIComponent(pickupCommune)}&pickupCommune=${encodeURIComponent(pickupCommune)}&clientCommune=${encodeURIComponent(clientCommune)}`
    );

    const isSameCommune = pickupCommune === clientCommune;
    const defaultPrice = isSameCommune ? 1500 : 2000;

    if (response.agences && response.agences.length > 0) {
      const bestAgence = response.agences.find(a => a.coversCommune) || response.agences[0];
      return {
        success: true,
        price: bestAgence.price || defaultPrice,
        isFree: false,
        currency: options.currency || 'FCFA',
        isSameCommune,
        agencesCount: response.agences.length,
        bestAgence: {
          id: bestAgence.id,
          name: bestAgence.companyName,
          phone: bestAgence.phone,
          price: bestAgence.price
        }
      };
    }

    return {
      success: true,
      price: defaultPrice,
      isFree: false,
      currency: options.currency || 'FCFA',
      isSameCommune,
      agencesCount: 0
    };
  }
}