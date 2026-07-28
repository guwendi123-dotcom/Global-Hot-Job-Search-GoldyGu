declare global {
  interface CloudflareEnv {
    HEADHUNTER_DATA: {
      get<T>(key: string, type: "json"): Promise<T | null>;
      put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
    };
    ASSETS: unknown;
    IMAGES: unknown;
    WORKER_SELF_REFERENCE: unknown;
    ADMIN_PASSWORD?: string;
    ADMIN_SESSION_TOKEN?: string;
    CLOUDFLARE_ANALYTICS_TOKEN?: string;
    CLOUDFLARE_ACCOUNT_ID?: string;
    CLOUDFLARE_ANALYTICS_SITE_TAG?: string;
  }
}

export {};
