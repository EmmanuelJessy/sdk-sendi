export default SendiAPI;
/**
 * Client principal de l'API Sendi
 */
export class SendiAPI {
    constructor(apiKey: any, config?: {});
    client: SendiClient;
    orders: OrdersResource;
    commercant: CommercantResource;
    agence: AgenceResource;
    delivery: DeliveryResource;
    stats: StatsResource;
    webhook: WebhookResource;
    /**
     * Vérifie la santé de l'API
     */
    health(): Promise<any>;
    /**
     * Récupère les communes disponibles
     */
    getCommunes(params?: {}): Promise<any>;
    /**
     * Récupère la configuration de livraison
     */
    getDeliveryConfig(): Promise<any>;
    /**
     * Calcule le prix de livraison
     */
    calculatePrice(pickupCommune: any, clientCommune: any, options?: {}): Promise<any>;
    /**
     * Vérifie la disponibilité d'une livraison
     */
    checkAvailability(pickupCommune: any, clientCommune: any): Promise<any>;
    /**
     * Récupère les agences disponibles
     */
    getAvailableAgences(commune: any, options?: {}): Promise<any>;
}
import { SendiClient } from './client.js';
import { SendiAPIError } from './errors.js';
import { OrdersResource } from './resources/orders.js';
import { CommercantResource } from './resources/commercant.js';
import { AgenceResource } from './resources/agence.js';
import { DeliveryResource } from './resources/delivery.js';
import { StatsResource } from './resources/stats.js';
import { WebhookResource } from './resources/webhook.js';
export { SendiClient, SendiAPIError, OrdersResource, CommercantResource, AgenceResource, DeliveryResource, StatsResource, WebhookResource };
//# sourceMappingURL=index.d.ts.map