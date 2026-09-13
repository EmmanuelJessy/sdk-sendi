export class DeliveryResource {
    constructor(client: any);
    client: any;
    /**
     * Récupérer la configuration de livraison
     * Retourne: { allowedCountries, interCountryEnabled, communes, ... }
     */
    getConfig(): Promise<any>;
    /**
     * Récupérer TOUTES les communes (filtrées par pays autorisés)
     */
    getCommunes(params?: {}): Promise<any>;
    /**
     * ✅ Récupérer les communes filtrées selon la config
     *
     * Logique (comme le plugin WordPress) :
     * - Si inter_country DÉSACTIVÉ → communes du pays du commerçant
     * - Si inter_country ACTIVÉ → communes de tous les pays autorisés
     */
    getFilteredCommunes(options?: {}): Promise<{
        success: boolean;
        communes: any;
        total: any;
        merchantCountry: any;
        interCountryEnabled: any;
        allowedCountries: any;
        error?: undefined;
    } | {
        success: boolean;
        communes: never[];
        total: number;
        error: any;
        merchantCountry?: undefined;
        interCountryEnabled?: undefined;
        allowedCountries?: undefined;
    }>;
    /**
     * Récupérer les agences disponibles avec leurs prix
     */
    getAvailableAgences(commune: any, options?: {}): Promise<any>;
    /**
     * Calculer le prix de livraison
     * Utilise /agences/available (comme le plugin)
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
     * Vérifier la disponibilité
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
    getCountries(): Promise<{
        countries: any;
        interCountryEnabled: any;
    }>;
    /**
     * Modes de livraison
     */
    getDeliveryModes(): Promise<{
        modes: {
            id: string;
            label: string;
        }[];
    }>;
    /**
     * Devises
     */
    getCurrencies(): Promise<{
        currencies: {
            code: string;
            label: string;
        }[];
    }>;
}
//# sourceMappingURL=delivery.d.ts.map