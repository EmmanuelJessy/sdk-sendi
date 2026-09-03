export class SendiAPIError extends Error {
    constructor(message: any, statusCode?: number, data?: null);
    statusCode: number;
    data: any;
    isValidationError(): boolean;
    isAuthError(): boolean;
    isCreditError(): boolean;
    isRateLimitError(): boolean;
    isServerError(): boolean;
    isNetworkError(): boolean;
    getErrorMessage(): any;
    toJSON(): {
        name: string;
        message: string;
        statusCode: number;
        data: any;
    };
}
export namespace ErrorMessages {
    let INVALID_API_KEY: string;
    let MISSING_API_KEY: string;
    let INVALID_REQUEST: string;
    let NETWORK_ERROR: string;
    let TIMEOUT: string;
    let NOT_FOUND: string;
    let UNAUTHORIZED: string;
    let FORBIDDEN: string;
    let RATE_LIMIT: string;
    let SERVER_ERROR: string;
    let CREDIT_ERROR: string;
}
export function createError(message: any, statusCode?: number, data?: null): SendiAPIError;
//# sourceMappingURL=errors.d.ts.map