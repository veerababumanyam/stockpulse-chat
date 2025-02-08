
export class RateLimiter {
  private retryDelay: number;
  private maxRetries: number;
  private rateLimitWindow: number;
  private requestCount: number;
  private lastRequestTime: number;
  private maxRequestsPerMinute: number;
  private pendingRequests: Set<string>;
  private waitingTime: number;
  private globalTimeout: NodeJS.Timeout | null;

  constructor() {
    this.retryDelay = 2000;
    this.maxRetries = 5;
    this.rateLimitWindow = 60000;
    this.requestCount = 0;
    this.lastRequestTime = Date.now();
    this.maxRequestsPerMinute = 1;
    this.pendingRequests = new Set();
    this.waitingTime = 0;
    this.globalTimeout = null;
  }

  async handleRateLimit(requestId: string, retryCount: number): Promise<number> {
    if (this.pendingRequests.has(requestId)) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      return this.handleRateLimit(requestId, retryCount);
    }

    this.pendingRequests.add(requestId);

    const timeSinceLastRequest = Date.now() - this.lastRequestTime;

    if (timeSinceLastRequest > this.rateLimitWindow) {
      this.requestCount = 0;
      this.lastRequestTime = Date.now();
      this.waitingTime = 0;
    }

    let baseWaitTime = 0;
    if (this.requestCount >= this.maxRequestsPerMinute) {
      baseWaitTime = Math.max(
        this.rateLimitWindow - timeSinceLastRequest + this.waitingTime,
        this.retryDelay * Math.pow(2, retryCount)
      );
    }

    const minRequestInterval = 3000;
    return Math.max(minRequestInterval, baseWaitTime);
  }

  resetGlobalTimeout() {
    if (this.globalTimeout) {
      clearTimeout(this.globalTimeout);
      this.globalTimeout = null;
    }
  }

  incrementRequestCount() {
    this.requestCount++;
    this.lastRequestTime = Date.now();
  }

  removePendingRequest(requestId: string) {
    this.pendingRequests.delete(requestId);
  }

  async handleBackoff(retryCount: number) {
    const backoffTime = this.retryDelay * Math.pow(2, retryCount);
    this.waitingTime += backoffTime;
    return new Promise((resolve) => {
      this.globalTimeout = setTimeout(resolve, backoffTime);
    });
  }

  getMaxRetries(): number {
    return this.maxRetries;
  }
}
