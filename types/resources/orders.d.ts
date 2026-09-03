export class OrdersResource {
    constructor(client: any);
    client: any;
    /**
     * Valide les données de la commande
     */
    validateOrderData(data: any): void;
    /**
     * Crée une commande
     */
    create(data: any): Promise<any>;
    /**
     * Récupère une commande
     */
    get(id: any): Promise<any>;
    /**
     * Liste les commandes avec filtres
     */
    list(params?: {}): Promise<any>;
    /**
     * Annule une commande
     */
    cancel(id: any, reason?: string): Promise<any>;
    /**
     * Suit une commande
     */
    track(id: any): Promise<any>;
    /**
     * Met à jour une commande
     */
    update(id: any, data: any): Promise<any>;
    /**
     * Confirme la réception d'une commande
     */
    confirmDelivery(id: any, codeSecret: any): Promise<any>;
    /**
     * Calcule le prix avant création
     */
    calculatePrice(pickupCommune: any, clientCommune: any, options?: {}): Promise<any>;
}
//# sourceMappingURL=orders.d.ts.map