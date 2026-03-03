

interface TokenState {
  token: string;
  remaining: number;
  resetAt: number;
  usedCount: number;
}

class TokenPool {
  private tokens: TokenState[] = [];
  private currentIndex = 0;

  constructor() {

    const mainToken = process.env.GITHUB_TOKEN;
    if (mainToken) {
      this.tokens.push({
        token: mainToken,
        remaining: 5000,
        resetAt: Date.now() + 3600000,
        usedCount: 0,
      });
    }

    // Load additional tokens if available
    let index = 2;
    let extraToken = process.env[`GITHUB_TOKEN_${index}`];
    while (extraToken) {
      this.tokens.push({
        token: extraToken,
        remaining: 5000,
        resetAt: Date.now() + 3600000,
        usedCount: 0,
      });
      index++;
      extraToken = process.env[`GITHUB_TOKEN_${index}`];
    }

    if (this.tokens.length === 0) {
      throw new Error(
        "No GitHub tokens found. Set GITHUB_TOKEN env variable at minimum."
      );
    }
  }


  getNextToken(): string {
    if (this.tokens.length === 0) {
      throw new Error("No tokens available in pool");
    }

    // Find token with most remaining quota
    let bestToken = this.tokens[0];
    let bestIndex = 0;

    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i];
      // If token is reset, reinitialize
      if (Date.now() > token.resetAt) {
        token.remaining = 5000;
        token.resetAt = Date.now() + 3600000;
        token.usedCount = 0;
      }

      if (token.remaining > bestToken.remaining) {
        bestToken = token;
        bestIndex = i;
      }
    }

    this.currentIndex = bestIndex;
    return bestToken.token;
  }

  updateTokenState(headers: Headers): void {
    if (this.tokens.length === 0) return;

    const currentToken = this.tokens[this.currentIndex];
    const remaining = headers.get("x-ratelimit-remaining");
    const resetHeader = headers.get("x-ratelimit-reset");

    if (remaining) {
      currentToken.remaining = parseInt(remaining, 10);
    }

    if (resetHeader) {
      currentToken.resetAt = parseInt(resetHeader, 10) * 1000; // Convert Unix timestamp to ms
    }

    currentToken.usedCount++;
  }


  getStatus() {
    return this.tokens.map((t, i) => ({
      index: i,
      remaining: t.remaining,
      resetAt: new Date(t.resetAt).toISOString(),
      usedCount: t.usedCount,
    }));
  }
}

let pool: TokenPool | null = null;

export function getTokenPool(): TokenPool {
  if (!pool) {
    pool = new TokenPool();
  }
  return pool;
}
