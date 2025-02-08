
import { RateLimiter } from './RateLimiter';

export class APIClient {
  private rateLimiter: RateLimiter;
  private requestQueue: Promise<any>;

  constructor() {
    this.rateLimiter = new RateLimiter();
    this.requestQueue = Promise.resolve();
  }

  async fetchData(url: string, apiKey: string, retryCount = 0): Promise<any> {
    const requestId = url;

    try {
      const requestInterval = await this.rateLimiter.handleRateLimit(requestId, retryCount);

      if (requestInterval > 0) {
        console.log(`Waiting ${requestInterval}ms before next request`);
        await new Promise(resolve => setTimeout(resolve, requestInterval));
      }

      return await new Promise((resolve, reject) => {
        this.requestQueue = this.requestQueue
          .then(async () => {
            try {
              this.rateLimiter.resetGlobalTimeout();
              this.rateLimiter.incrementRequestCount();

              const response = await fetch(url);
              
              if (response.status === 429) {
                if (retryCount < this.rateLimiter.getMaxRetries()) {
                  await this.rateLimiter.handleBackoff(retryCount);
                  this.rateLimiter.removePendingRequest(requestId);
                  return this.fetchData(url, apiKey, retryCount + 1);
                } else {
                  throw new Error('API rate limit reached. Please try again later.');
                }
              }

              if (!response.ok) {
                throw new Error(`API call failed: ${response.statusText}`);
              }

              const data = await response.json();
              resolve(data);
              return data;
            } catch (error: any) {
              console.error('Error in fetchData:', error);
              reject(new Error(error.message || 'Failed to fetch data'));
            } finally {
              this.rateLimiter.removePendingRequest(requestId);
            }
          })
          .catch(error => {
            this.rateLimiter.removePendingRequest(requestId);
            reject(error);
          });
      });
    } catch (error) {
      this.rateLimiter.removePendingRequest(requestId);
      throw error;
    }
  }
}
