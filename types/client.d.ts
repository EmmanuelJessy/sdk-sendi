export class SendiClient {
    constructor(config?: {});
    apiKey: any;
    baseURL: any;
    timeout: any;
    maxRetries: any;
    retryDelay: any;
    headers: any;
    _getHeaders(): any;
    _retryRequest(fn: any, retries?: any): any;
    request(method: any, endpoint: any, options?: {}): Promise<any>;
    get(endpoint: any, options?: {}): Promise<any>;
    post(endpoint: any, data?: {}, options?: {}): Promise<any>;
    put(endpoint: any, data?: {}, options?: {}): Promise<any>;
    delete(endpoint: any, options?: {}): Promise<any>;
    patch(endpoint: any, data?: {}, options?: {}): Promise<any>;
}
//# sourceMappingURL=client.d.ts.map