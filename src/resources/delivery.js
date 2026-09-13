// src/resources/delivery.js
import { SendiAPIError } from '../errors.js';

export class DeliveryResource {
  constructor(client) {
    this.client = client;
  }

  /**
   * Récupérer la configuration de livraison
   * Retourne: { allowedCountries, interCountryEnabled, communes, ... }
   */
  async getConfig() {
    return this.client.get('/delivery/config');
  }

  /**
   * Récupérer TOUTES les communes (filtrées par pays autorisés)
   */
  async getCommunes(params = {}) {
    const query = new URLSearchParams();
    if (params.country) query.append('country', params.country);
    if (params.search) query.append('search', params.search);
    const endpoint = query.toString() ? `/communes?${query}` : '/communes';
    return this.client.get(endpoint);
  }

  /**
   * ✅ Récupérer les communes filtrées selon la config
   * 
   * Logique (comme le plugin WordPress) :
   * - Si inter_country DÉSACTIVÉ → communes du pays du commerçant
   * - Si inter_country ACTIVÉ → communes de tous les pays autorisés
   */
  async getFilteredCommunes(options = {}) {
    const {
      merchantCountry = 'CI',
      interCountryEnabled = false,
      allowedCountries = ['CI']
    } = options;

    try {
      // Récupérer toutes les communes
      const response = await this.getCommunes();
      const allCommunes = response.communes || [];

      // ✅ Filtrer selon la config (COMME LE PLUGIN)
      let filtered = [];

      if (!interCountryEnabled) {
        // Ne garder que les communes du pays du commerçant
        filtered = allCommunes.filter(c => {
          const countryCode = c.countryCode || c.country || 'CI';
          return countryCode === merchantCountry;
        });
      } else {
        // Garder les communes des pays autorisés
        filtered = allCommunes.filter(c => {
          const countryCode = c.countryCode || c.country || 'CI';
          return allowedCountries.includes(countryCode);
        });
      }

      // Si aucune commune filtrée, retourner toutes
      if (filtered.length === 0) {
        filtered = allCommunes;
      }

      return {
        success: true,
        communes: filtered,
        total: filtered.length,
        merchantCountry,
        interCountryEnabled,
        allowedCountries
      };

    } catch (error) {
      console.error('❌ Erreur filtrage communes:', error.message);
      return {
        success: false,
        communes: [],
        total: 0,
        error: error.message
      };
    }
  }

  /**
   * Récupérer les agences disponibles avec leurs prix
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
   * Utilise /agences/available (comme le plugin)
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

    // ✅ 3. Sinon, utiliser /agences/available
    try {
      const response = await this.getAvailableAgences(pickupCommune, {
        pickupCommune,
        clientCommune,
        countryCode
      });

      if (response.agences && response.agences.length > 0) {
        const bestAgence = response.agences.find(a => a.coversCommune) || response.agences[0];
        const price = bestAgence.price || (isSameCommune ? 1500 : 2000);

        return {
          success: true,
          price,
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
   * Vérifier la disponibilité
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
      return { available: false, agencesCount: 0, error: error.message };
    }
  }

  /**
   * Récupérer les pays autorisés
   */
  async getCountries() {
    try {
      const config = await this.getConfig();
      return {
        countries: config.allowedCountries || ['CI'],
        interCountryEnabled: config.interCountryEnabled || false
      };
    } catch (error) {
      return { countries: ['CI'], interCountryEnabled: false };
    }
  }

  /**
   * Modes de livraison
   */
  async getDeliveryModes() {
    return {
      modes: [
        { id: 'client_pays', label: 'Client paie la livraison' },
        { id: 'merchant_pays', label: 'Commerçant paie (gratuit pour le client)' },
        { id: 'threshold', label: 'Gratuit à partir d\'un montant' }
      ]
    };
  }

  /**
   * Devises
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