/**
 * Ressource de gestion des livraisons
 * Correspond aux fonctionnalités du plugin WordPress SendiAPI
 */
export class DeliveryResource {
    constructor(client: any);
    client: any;
    /**
     * Récupérer la configuration de livraison
     * Utilise: GET /delivery/config (existe dans ton backend)
     */
    getConfig(): Promise<any>;
    /**
     * Récupérer les communes
     * Utilise: GET /communes (existe dans ton backend)
     */
    getCommunes(params?: {}): Promise<any>;
    /**
     * Récupérer les agences disponibles avec leurs prix
     * Utilise: GET /agences/available (existe dans ton backend)
     *
     * ⚠️ C'est CETTE route que ton plugin WordPress utilise !
     */
    getAvailableAgences(commune: any, options?: {}): Promise<any>;
    /**
     * Calculer le prix de livraison
     *
     * ⚠️ IMPORTANT: Utilise /agences/available (comme le plugin WordPress)
     * car /delivery/price n'existe PAS dans ton backend.
     */
    calculatePrice(pickupCommune: any, clientCommune: any, options?: {}): Promise<{
        success: boolean;
        price: number;
        isFree: boolean;
        currency: any;
        reason: string;
        isSameCommune?: undefined;
        agencesCount?: undefined;
        bestAgence?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        price: any;
        isFree: boolean;
        currency: any;
        isSameCommune: boolean;
        reason: string;
        agencesCount: any;
        bestAgence: {
            id: any;
            name: any;
            phone: any;
            price: any;
        };
        error?: undefined;
    } | {
        success: boolean;
        price: number;
        isFree: boolean;
        currency: any;
        isSameCommune: boolean;
        reason: string;
        agencesCount: number;
        bestAgence?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        price: number;
        isFree: boolean;
        currency: any;
        isSameCommune: boolean;
        reason: string;
        error: any;
        agencesCount?: undefined;
        bestAgence?: undefined;
    }>;
    /**
     * Vérifier la disponibilité d'une livraison
     */
    checkAvailability(pickupCommune: any, clientCommune: any): Promise<{
        available: any;
        agencesCount: any;
        estimatedTime: string;
        error?: undefined;
    } | {
        available: boolean;
        agencesCount: number;
        error: any;
        estimatedTime?: undefined;
    }>;
    /**
     * Récupérer les pays autorisés
     */
    getCountries(): Promise<any>;
    /**
     * Modes de livraison disponibles
     */
    getDeliveryModes(): Promise<{
        modes: {
            id: string;
            label: string;
        }[];
    }>;
    /**
     * Devises disponibles
     */
    getCurrencies(): Promise<{
        currencies: {
            code: string;
            label: string;
        }[];
    }>;
}
//# sourceMappingURL=delivery.d.ts.map