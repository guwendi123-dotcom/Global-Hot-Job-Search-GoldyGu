declare global {
  interface CloudflareEnv {
    HEADHUNTER_DATA: {
      get<T>(key: string, type: "json"): Promise<T | null>;
      put(key: string, value: string): Promise<void>;
    };
    ASSETS: unknown;
    IMAGES: unknown;
    WORKER_SELF_REFERENCE: unknown;
    ADMIN_PASSWORD?: string;
    ADMIN_SESSION_TOKEN?: string;
  }
}

export {};
