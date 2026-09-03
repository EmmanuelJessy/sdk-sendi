// types/index.d.ts
declare module 'sendi-api' {
  // ============================================
  // TYPES DE BASE
  // ============================================
  
  export interface OrderData {
    // Infos client
    clientName: string;
    clientPhone: string;
    clientAddress: string;
    clientCommune: string;
    clientCountry?: string;
    
    // Infos pickup
    pickupAddress: string;
    pickupCommune: string;
    pickupCountry?: string;
    
    // Infos commerçant
    merchantName?: string;
    merchantPhone?: string;
    merchantEmail?: string;
    merchantCountry?: string;
    merchantCommune?: string;
    
    // Configuration livraison
    deliveryMode?: 'client_pays' | 'merchant_pays' | 'threshold';
    freeThreshold?: number;
    currency?: string;
    
    // Inter-pays
    interCountryEnabled?: boolean;
    allowedCountries?: string[];
    
    // Détails commande
    orderTotal?: number;
    packageWeight?: number;
    packageDescription?: string;
    packageDimensions?: {
      length: number;
      width: number;
      height: number;
    };
    
    // Options
    instructions?: string;
    preferredDate?: string;
    preferredTime?: string;
    isExpress?: boolean;
  }

  export interface DeliveryConfig {
    country: string;
    commune: string;
    phone: string;
    deliveryMode: 'client_pays' | 'merchant_pays' | 'threshold';
    freeThreshold: number;
    currency: string;
    interCountryEnabled: boolean;
    allowedCountries: string[];
    pickupAddress: string;
    merchantName: string;
    merchantEmail: string;
  }

  // ============================================
  // CLASSE PRINCIPALE
  // ============================================
  
  export class SendiAPI {
    constructor(apiKey: string, config?: {
      baseURL?: string;
      timeout?: number;
      headers?: Record<string, string>;
    });

    // Ressources
    orders: OrdersResource;
    commercant: CommercantResource;
    agence: AgenceResource;
    delivery: DeliveryResource;
    stats: StatsResource;
    webhook: WebhookResource;

    // Méthodes utilitaires
    health(): Promise<any>;
    getCommunes(params?: { country?: string }): Promise<any>;
    getDeliveryConfig(): Promise<DeliveryConfig>;
    calculatePrice(
      pickupCommune: string, 
      clientCommune: string, 
      options?: any
    ): Promise<any>;
  }

  // ============================================
  // RESSOURCE: ORDRES
  // ============================================
  
  export class OrdersResource {
    create(data: OrderData): Promise<any>;
    get(id: string): Promise<any>;
    list(params?: {
      status?: string;
      limit?: number;
      page?: number;
      startDate?: string;
      endDate?: string;
      search?: string;
    }): Promise<any>;
    cancel(id: string, reason?: string): Promise<any>;
    track(id: string): Promise<any>;
    update(id: string, data: Partial<OrderData>): Promise<any>;
    confirmDelivery(id: string, codeSecret: string): Promise<any>;
    calculatePrice(
      pickupCommune: string, 
      clientCommune: string, 
      options?: any
    ): Promise<any>;
  }

  // ============================================
  // RESSOURCE: COMMERCANT
  // ============================================
  
  export class CommercantResource {
    // Crédits
    getCredits(): Promise<any>;
    recharge(amount: number, paymentMethod?: string): Promise<any>;
    
    // API Key
    getApiKey(): Promise<any>;
    regenerateApiKey(): Promise<any>;
    
    // Statistiques
    getStats(): Promise<any>;
    getOrders(params?: any): Promise<any>;
    getProfile(): Promise<any>;
    
    // Configuration livraison
    getDeliveryConfig(): Promise<DeliveryConfig>;
    updateDeliveryConfig(config: Partial<DeliveryConfig>): Promise<any>;
    getCountries(): Promise<any>;
    getCommunesByCountry(countryCode: string): Promise<any>;
  }

  // ============================================
  // RESSOURCE: AGENCE
  // ============================================
  
  export class AgenceResource {
    getSolde(): Promise<any>;
    getCourses(params?: {
      status?: string;
      limit?: number;
      page?: number;
    }): Promise<any>;
    updateStatus(courseId: string, status: string, livreurId?: string): Promise<any>;
    getLivreurs(): Promise<any>;
  }

  // ============================================
  // RESSOURCE: LIVRAISON
  // ============================================
  
  export class DeliveryResource {
    getConfig(): Promise<DeliveryConfig>;
    updateConfig(config: Partial<DeliveryConfig>): Promise<any>;
    getCommunes(params?: {
      country?: string;
      search?: string;
      limit?: number;
    }): Promise<any>;
    getCountries(): Promise<any>;
    calculatePrice(
      pickupCommune: string, 
      clientCommune: string, 
      options?: any
    ): Promise<any>;
    checkAvailability(pickupCommune: string, clientCommune: string): Promise<any>;
    getAvailableAgences(commune: string, options?: any): Promise<any>;
    getDeliveryModes(): Promise<any>;
    getCurrencies(): Promise<any>;
  }

  // ============================================
  // RESSOURCE: STATISTIQUES
  // ============================================
  
  export class StatsResource {
    getMerchantStats(): Promise<any>;
    getOrdersStats(params?: {
      startDate?: string;
      endDate?: string;
      status?: string;
      groupBy?: string;
    }): Promise<any>;
    getDeliveryStats(): Promise<any>;
    getTopAgences(limit?: number): Promise<any>;
    getPerformance(): Promise<any>;
    getRevenueStats(params?: {
      startDate?: string;
      endDate?: string;
      period?: string;
    }): Promise<any>;
    getCommuneStats(): Promise<any>;
  }

  // ============================================
  // RESSOURCE: WEBHOOK
  // ============================================
  
  export class WebhookResource {
    list(): Promise<any>;
    create(data: {
      url: string;
      events?: string[];
      secret?: string;
      enabled?: boolean;
      description?: string;
    }): Promise<any>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<any>;
    test(id: string): Promise<any>;
    getEvents(): Promise<any>;
    generateSecret(): string;
  }

  // ============================================
  // GESTION DES ERREURS
  // ============================================
  
  export class SendiAPIError extends Error {
    statusCode: number;
    data: any;
    constructor(message: string, statusCode?: number, data?: any);
    isValidationError(): boolean;
    isAuthError(): boolean;
    isCreditError(): boolean;
    isRateLimitError(): boolean;
    isServerError(): boolean;
  }

  export default SendiAPI;
}