// src/resources/delivery.js
import { SendiAPIError } from '../errors.js';

/**
 * Ressource de gestion des livraisons
 * Correspond aux fonctionnalités du plugin WordPress SendiAPI
 */
export class DeliveryResource {
  constructor(client) {
    this.client = client;
  }

  /**
   * Récupérer la configuration de livraison
   * Utilise: GET /delivery/config (existe dans ton backend)
   */
  async getConfig() {
    return this.client.get('/delivery/config');
  }

  /**
   * Récupérer les communes
   * Utilise: GET /communes (existe dans ton backend)
   */
  async getCommunes(params = {}) {
    const query = new URLSearchParams();
    if (params.country) query.append('country', params.country);
    if (params.search) query.append('search', params.search);
    const endpoint = query.toString() ? `/communes?${query}` : '/communes';
    return this.client.get(endpoint);
  }

  /**
   * Récupérer les agences disponibles avec leurs prix
   * Utilise: GET /agences/available (existe dans ton backend)
   * 
   * ⚠️ C'est CETTE route que ton plugin WordPress utilise !
   */
  async getAvailableAgences(commune, options = {}) {
    const params = new URLSearchParams({ commune });
    if (options.pickupCommune) params.append('pickupCommune', options.pickupCommune);
    if (options.clientCommune) params.append('clientCommune', options.clientCommune);
    if (options.countryCode) params.append('countryCode', options.countryCode);
    return this.client.get(`/agences/available?${params}`);
  }

  /**
   * Calculer le prix de livraison
   * 
   * ⚠️ IMPORTANT: Utilise /agences/available (comme le plugin WordPress)
   * car /delivery/price n'existe PAS dans ton backend.
   */
  async calculatePrice(pickupCommune, clientCommune, options = {}) {
    if (!pickupCommune || !clientCommune) {
      throw new SendiAPIError('pickupCommune et clientCommune requis', 400);
    }

    const {
      deliveryMode = 'client_pays',
      freeThreshold = 0,
      orderTotal = 0,
      currency = 'FCFA',
      countryCode = 'CI'
    } = options;

    const isSameCommune = pickupCommune.toLowerCase() === clientCommune.toLowerCase();

    // ✅ 1. Si le commerçant paie → gratuit
    if (deliveryMode === 'merchant_pays') {
      return {
        success: true,
        price: 0,
        isFree: true,
        currency,
        reason: 'merchant_pays'
      };
    }

    // ✅ 2. Si threshold ET orderTotal >= freeThreshold → gratuit
    if (
      deliveryMode === 'threshold' &&
      Number(freeThreshold) > 0 &&
      Number(orderTotal) >= Number(freeThreshold)
    ) {
      return {
        success: true,
        price: 0,
        isFree: true,
        currency,
        reason: 'threshold_reached'
      };
    }

    // ✅ 3. Sinon, utiliser /agences/available (COMME LE PLUGIN)
    try {
      const response = await this.getAvailableAgences(pickupCommune, {
        pickupCommune,
        clientCommune,
        countryCode
      });

      // ✅ Si des agences sont disponibles
      if (response.agences && response.agences.length > 0) {
        // Prendre la meilleure agence (celle qui couvre la commune)
        const bestAgence = response.agences.find(a => a.coversCommune) || response.agences[0];
        
        const price = bestAgence.price || (isSameCommune ? 1500 : 2000);

        return {
          success: true,
          price: price,
          isFree: false,
          currency,
          isSameCommune,
          reason: 'agence',
          agencesCount: response.agences.length,
          bestAgence: {
            id: bestAgence.id,
            name: bestAgence.companyName,
            phone: bestAgence.phone,
            price: bestAgence.price
          }
        };
      }

      // ✅ Aucune agence → prix par défaut
      return {
        success: true,
        price: isSameCommune ? 1500 : 2000,
        isFree: false,
        currency,
        isSameCommune,
        reason: 'default',
        agencesCount: 0
      };

    } catch (error) {
      // ✅ En cas d'erreur, retourner le prix par défaut
      console.warn('⚠️ Erreur calcul prix via agences:', error.message);
      return {
        success: true,
        price: isSameCommune ? 1500 : 2000,
        isFree: false,
        currency,
        isSameCommune,
        reason: 'fallback',
        error: error.message
      };
    }
  }

  /**
   * Vérifier la disponibilité d'une livraison
   */
  async checkAvailability(pickupCommune, clientCommune) {
    try {
      const response = await this.getAvailableAgences(pickupCommune, {
        pickupCommune,
        clientCommune
      });

      return {
        available: response.agences && response.agences.length > 0,
        agencesCount: response.agences?.length || 0,
        estimatedTime: '30-45 min'
      };
    } catch (error) {
      return {
        available: false,
        agencesCount: 0,
        error: error.message
      };
    }
  }

  /**
   * Récupérer les pays autorisés
   */
  async getCountries() {
    return this.client.get('/delivery/countries');
  }

  /**
   * Modes de livraison disponibles
   */
  async getDeliveryModes() {
    return {
      modes: [
        { id: 'client_pays', label: 'Client paie la livraison' },
        { id: 'merchant_pays', label: 'Commerçant paie la livraison (gratuit pour le client)' },
        { id: 'threshold', label: 'Gratuit à partir d\'un montant' }
      ]
    };
  }

  /**
   * Devises disponibles
   */
  async getCurrencies() {
    return {
      currencies: [
        { code: 'FCFA', label: 'Franc CFA' },
        { code: 'XOF', label: 'Franc CFA (ISO)' },
        { code: 'EUR', label: 'Euro' },
        { code: 'USD', label: 'Dollar US' }
      ]
    };
  }
}