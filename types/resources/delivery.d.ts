/**
 * Ressource de gestion des livraisons
 * Correspond aux fonctionnalités du plugin WordPress SendiAPI
 */
export class DeliveryResource {
    constructor(client: any);
    client: any;
    /**
     * Récupérer la configuration de livraison du commerçant
     * Correspond à: get_option('livraison_api_*') dans WordPress
     */
    getConfig(): Promise<any>;
    /**
     * Mettre à jour la configuration de livraison
     * Correspond à: update_option('livraison_api_*') dans WordPress
     */
    updateConfig(config: any): Promise<any>;
    /**
     * Récupérer les communes
     * Correspond à: get_communes() dans WordPress
     */
    getCommunes(params?: {}): Promise<any>;
    /**
     * Récupérer les pays autorisés
     * Correspond à: get_option('livraison_api_allowed_countries') dans WordPress
     */
    getCountries(): Promise<any>;
    /**
     * Calculer le prix de livraison
     * Correspond à: la logique de calcul de prix dans le plugin
     */
    calculatePrice(pickupCommune: any, clientCommune: any, options?: {}): Promise<any>;
    /**
     * Vérifier la disponibilité d'une livraison
     */
    checkAvailability(pickupCommune: any, clientCommune: any): Promise<any>;
    /**
     * Récupérer les agences disponibles
     * Correspond à: get_available_agences() dans WordPress
     */
    getAvailableAgences(commune: any, options?: {}): Promise<any>;
    /**
     * Récupérer les modes de livraison disponibles
     * Correspond à: les options de livraison dans le plugin
     */
    getDeliveryModes(): Promise<{
        modes: {
            id: string;
            label: string;
        }[];
    }>;
    /**
     * Récupérer les devises disponibles
     */
    getCurrencies(): Promise<{
        currencies: {
            code: string;
            label: string;
        }[];
    }>;
}
//# sourceMappingURL=delivery.d.ts.map