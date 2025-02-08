
export class RateLimiter {
  private retryDelay: number;
  private maxRetries: number;
  private rateLimitWindow: number;
  private requestCount: number;
  private lastRequestTime: number;
  private maxRequestsPerMinute: number;
  private pendingRequests: Set<string>;

  constructor() {
    this.retryDelay = 500; // Reduced from 1000
    this.maxRetries = 2; // Reduced from 3
    this.rateLimitWindow = 10000; // Reduced from 30000
    this.requestCount = 0;
    this.lastRequestTime = Date.now();
    this.maxRequestsPerMinute = 10; // Increased from 5
    this.pendingRequests = new Set();
  }

  async handleRateLimit(requestId: string, retryCount: number): Promise<number> {
    if (this.pendingRequests.has(requestId)) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.handleRateLimit(requestId, retryCount);
    }

    this.pendingRequests.add(requestId);
    const timeSinceLastRequest = Date.now() - this.lastRequestTime;

    if (timeSinceLastRequest > this.rateLimitWindow) {
      this.requestCount = 0;
      this.lastRequestTime = Date.now();
    }

    let waitTime = 0;
    if (this.requestCount >= this.maxRequestsPerMinute) {
      waitTime = Math.max(
        500,
        this.retryDelay * Math.pow(1.2, retryCount)
      );
    }

    return waitTime;
  }

  resetGlobalTimeout() {
    // No longer needed
  }

  incrementRequestCount() {
    this.requestCount++;
    this.lastRequestTime = Date.now();
  }

  removePendingRequest(requestId: string) {
    this.pendingRequests.delete(requestId);
  }

  async handleBackoff(retryCount: number) {
    const backoffTime = this.retryDelay * Math.pow(1.2, retryCount);
    return new Promise((resolve) => setTimeout(resolve, backoffTime));
  }

  getMaxRetries(): number {
    return this.maxRetries;
  }
}

