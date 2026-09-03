export default SendiAPI;
/**
 * Client principal de l'API Sendi
 */
export class SendiAPI {
    constructor(apiKey: any, config?: {});
    client: any;
    orders: any;
    commercant: any;
    agence: any;
    /**
     * Vérifie la santé de l'API
     */
    health(): Promise<any>;
    /**
     * Récupère les communes disponibles
     */
    getCommunes(): Promise<any>;
}
export { SendiClient, SendiAPIError, ErrorMessages, createError, OrdersResource, CommercantResource, AgenceResource };
//# sourceMappingURL=index.d.ts.map