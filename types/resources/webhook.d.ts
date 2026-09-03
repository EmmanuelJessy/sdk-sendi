/**
 * Ressource de gestion des webhooks
 */
export class WebhookResource {
    constructor(client: any);
    client: any;
    /**
     * Récupérer la liste des webhooks
     */
    list(): Promise<any>;
    /**
     * Créer un webhook
     */
    create(data: any): Promise<any>;
    /**
     * Mettre à jour un webhook
     */
    update(id: any, data: any): Promise<any>;
    /**
     * Supprimer un webhook
     */
    delete(id: any): Promise<any>;
    /**
     * Tester un webhook
     */
    test(id: any): Promise<any>;
    /**
     * Récupérer les événements disponibles
     */
    getEvents(): Promise<{
        events: {
            id: string;
            label: string;
        }[];
    }>;
    /**
     * Générer un secret aléatoire
     */
    generateSecret(): string;
}
//# sourceMappingURL=webhook.d.ts.map