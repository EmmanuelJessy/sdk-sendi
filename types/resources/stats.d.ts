/**
 * Ressource de gestion des statistiques
 */
export class StatsResource {
    constructor(client: any);
    client: any;
    /**
     * Statistiques du commerçant
     * Correspond à: les stats dans le dashboard WordPress
     */
    getMerchantStats(): Promise<any>;
    /**
     * Statistiques des commandes
     */
    getOrdersStats(params?: {}): Promise<any>;
    /**
     * Statistiques de livraison
     */
    getDeliveryStats(): Promise<any>;
    /**
     * Top des agences
     */
    getTopAgences(limit?: number): Promise<any>;
    /**
     * Performance globale
     */
    getPerformance(): Promise<any>;
    /**
     * Statistiques de revenus
     */
    getRevenueStats(params?: {}): Promise<any>;
    /**
     * Statistiques des livraisons par commune
     */
    getCommuneStats(): Promise<any>;
}
//# sourceMappingURL=stats.d.ts.map