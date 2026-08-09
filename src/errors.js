
// src/errors.js
export class SendiAPIError extends Error {
    constructor(message, statusCode = 500, data = null) {
      super(message);
      this.name = 'SendiAPIError';
      this.statusCode = statusCode;
      this.data = data;
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, SendiAPIError);
      }
    }
  
    isValidationError() { return this.statusCode === 400; }
    isAuthError() { return this.statusCode === 401; }
    isCreditError() { return this.statusCode === 402; }
    isRateLimitError() { return this.statusCode === 429; }
  }