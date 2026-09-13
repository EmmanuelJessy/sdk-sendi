export class OrdersResource {
    constructor(client: any);
    client: any;
    /**
     * Valide les données de la commande
     */
    validateOrderData(data: any): void;
    /**
     * Crée une commande
     *
     * ✅ Envoie les champs que ton backend attend (createOrder dans publicController.js)
     * et laisse le backend calculer le prix selon l'agence.
     */
    create(data: any): Promise<any>;
    /**
     * Récupère une commande
     */
    get(id: any): Promise<any>;
    /**
     * Suit une commande
     */
    track(id: any): Promise<any>;
    /**
     * Annule une commande
     */
    cancel(id: any, reason?: string): Promise<any>;
    /**
     * Liste les commandes du commerçant
     */
    list(params?: {}): Promise<any>;
    /**
     * Met à jour une commande
     */
    update(id: any, data: any): Promise<any>;
    /**
     * Confirme la réception d'une commande
     */
    confirmDelivery(id: any, codeSecret: any): Promise<any>;
    /**
     * Calcule le prix AVANT création
     *
     * ⚠️ Utilise /agences/available (comme le plugin)
     * via delivery.calculatePrice()
     */
    calculatePrice(pickupCommune: any, clientCommune: any, options?: {}): Promise<{
        success: boolean;
        price: any;
        isFree: boolean;
        currency: any;
        isSameCommune: boolean;
        agencesCount: any;
        bestAgence: {
            id: any;
            name: any;
            phone: any;
            price: any;
        };
    } | {
        success: boolean;
        price: number;
        isFree: boolean;
        currency: any;
        isSameCommune: boolean;
        agencesCount: number;
        bestAgence?: undefined;
    }>;
}
//# sourceMappingURL=orders.d.ts.map