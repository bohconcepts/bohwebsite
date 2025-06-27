/**
 * Helper functions for Supabase Auth integration
 */

/**
 * Check if localStorage is supported and usable
 */
export function supportsLocalStorage(): boolean {
  try {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    
    // Test if localStorage is actually usable
    const key = 'supabase.test';
    localStorage.setItem(key, 'test');
    localStorage.removeItem(key);
    
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if the current environment is a browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Get a cookie value by name
 */
export function getCookieValue(name: string): string | undefined {
  if (!isBrowser()) return undefined;
  
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  
  return undefined;
}

/**
 * Set a cookie
 */
export function setCookieValue(
  name: string, 
  value: string, 
  options: {
    maxAge?: number;
    domain?: string;
    path?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {}
): void {
  if (!isBrowser()) return;
  
  const { maxAge, domain, path = '/', secure, sameSite } = options;
  
  let cookie = `${name}=${encodeURIComponent(value)}`;
  
  if (maxAge !== undefined) cookie += `; max-age=${maxAge}`;
  if (domain) cookie += `; domain=${domain}`;
  if (path) cookie += `; path=${path}`;
  if (secure) cookie += '; secure';
  if (sameSite) cookie += `; samesite=${sameSite}`;
  
  document.cookie = cookie;
}

/**
 * Remove a cookie
 */
export function removeCookie(name: string, path = '/'): void {
  if (isBrowser()) {
    document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

/**
 * Type for fetch function
 */
type Fetch = typeof fetch;

/**
 * Resolve fetch implementation
 * Required by @supabase/storage-js
 */
export const resolveFetch = (customFetch?: Fetch): Fetch => {
  let _fetch: Fetch;
  
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === 'undefined') {
    // This is a simplified version that doesn't attempt to import node-fetch
    _fetch = ((..._: any[]) => {
      console.warn('Fetch is not available in this environment');
      return Promise.reject(new Error('Fetch is not available in this environment'));
    }) as Fetch;
  } else {
    _fetch = fetch;
  }
  
  return (...args: Parameters<Fetch>) => _fetch(...args);
};

/**
 * Resolve Response object for Supabase Storage
 * Required by @supabase/storage-js
 */
export const resolveResponse = async (): Promise<typeof Response> => {
  if (typeof Response === 'undefined') {
    // In environments without Response, return a shim
    return class ResponseShim {
      body: any;
      status: number;
      ok: boolean;
      headers: Map<string, string>;
      
      constructor(body: any, init: { status?: number; headers?: Record<string, string> } = {}) {
        this.body = body;
        this.status = init.status || 200;
        this.ok = this.status >= 200 && this.status < 300;
        this.headers = new Map(Object.entries(init.headers || {}));
      }
      
      json(): Promise<any> {
        return Promise.resolve(JSON.parse(this.body));
      }
      
      text(): Promise<string> {
        return Promise.resolve(this.body);
      }
    } as unknown as typeof Response;
  }
  return Response;
};

/**
 * Recursive camelCase keys for Supabase Storage
 * Required by @supabase/storage-js
 */
export const recursiveToCamel = (item: any): any => {
  if (Array.isArray(item)) {
    return item.map(el => recursiveToCamel(el));
  } else if (typeof item === 'function' || item !== Object(item)) {
    return item;
  }
  
  const result: Record<string, any> = {};
  Object.entries(item).forEach(([key, value]) => {
    const newKey = key.replace(/([-_][a-z])/gi, (c: string) => 
      c.toUpperCase().replace(/[-_]/g, '')
    );
    result[newKey] = recursiveToCamel(value);
  });
  
  return result;
};
