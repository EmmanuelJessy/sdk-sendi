export class CommercantResource {
    constructor(client: any);
    client: any;
    /**
     * Récupère les crédits
     */
    getCredits(): Promise<any>;
    /**
     * Recharge les crédits
     */
    recharge(amount: any, paymentMethod?: string): Promise<any>;
    /**
     * Récupère la clé API
     */
    getApiKey(): Promise<any>;
    /**
     * Régénère la clé API
     */
    regenerateApiKey(): Promise<any>;
    /**
     * Récupère les statistiques
     */
    getStats(): Promise<any>;
    /**
     * Récupère les commandes
     */
    getOrders(params?: {}): Promise<any>;
    /**
     * Récupère le profil
     */
    getProfile(): Promise<any>;
    /**
     * Récupère la configuration de livraison
     */
    getDeliveryConfig(): Promise<any>;
    /**
     * Met à jour la configuration de livraison
     */
    updateDeliveryConfig(config: any): Promise<any>;
    /**
     * Récupère les pays disponibles
     */
    getCountries(): Promise<any>;
    /**
     * Récupère les communes par pays
     */
    getCommunesByCountry(countryCode: any): Promise<any>;
    /**
     * Récupère l'historique des transactions
     */
    getTransactions(params?: {}): Promise<any>;
    /**
     * Récupère les notifications
     */
    getNotifications(params?: {}): Promise<any>;
    /**
     * Marque une notification comme lue
     */
    markNotificationAsRead(notificationId: any): Promise<any>;
}
//# sourceMappingURL=commercant.d.ts.map