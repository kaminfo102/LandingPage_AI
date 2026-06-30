import { Product, Category, Order, CreateOrderPayload, Post } from "../types";

const STORAGE_KEY = "woo_config";
const PRODUCTS_CACHE_KEY = "woo_products_default_cache"; // New persistent cache

// --- Cache Configuration ---
const CACHE_TTL = 5 * 60 * 1000; // 5 Minutes RAM Cache
const cache = new Map<string, { data: any; expiry: number }>();
const pendingRequests = new Map<string, Promise<any>>();

interface WooConfig {
  url: string;
  key: string;
  secret: string;
}

export const getWooConfig = async (): Promise<WooConfig> => {
  try {
    const res = await fetch('/api/woo-config');
    if (res.ok) {
      const config = await res.json();
      return config;
    }
  } catch (e) {
    console.warn("Failed to get config from server", e);
  }
  return {
    url: '', key: '', secret: ''
  };
};

export const saveWooConfig = async (url: string, key: string, secret: string) => {
  try {
    const res = await fetch('/api/woo-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, key, secret })
    });
    if (!res.ok) {
       let errorMsg = 'Failed to save configuration';
       try {
         const err = await res.json();
         errorMsg = err.error || errorMsg;
       } catch (e) {
         // Not JSON, perhaps HTML or empty
         const text = await res.text();
         errorMsg = `Server error (${res.status}): ${text.substring(0, 50)}...`;
       }
       throw new Error(errorMsg);
    }
    cache.clear();
    localStorage.removeItem(PRODUCTS_CACHE_KEY); // Clear product cache on config change
  } catch (e) {
    console.error("Failed to save config to server", e);
    throw e;
  }
};

// --- Advanced Fetch Wrapper ---
interface RequestOptions extends RequestInit {
  skipCache?: boolean;
  params?: Record<string, string>;
  isWpApi?: boolean;
  timeout?: number;
}

const request = async <T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> => {
  const apiPath = options.isWpApi ? "/wp-json/wp/v2" : "/wp-json/wc/v3";

  const urlObj = new URL(window.location.origin + `/api/woo${apiPath}${endpoint}`);
  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value) urlObj.searchParams.append(key, value);
    });
  }

  const cacheKey = urlObj.toString();

  // RAM Cache
  if (!options.skipCache && (!options.method || options.method === "GET")) {
    const cached = cache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
  }

  if (!options.skipCache && (!options.method || options.method === "GET")) {
    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey);
    }
  }

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const requestPromise = (async () => {
    let lastError: any;
    const maxRetries = 3;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutValue = options.timeout || 30000;
        const timeoutId = setTimeout(
          () => controller.abort("Request timed out"),
          timeoutValue,
        );

        const response = await fetch(urlObj.toString(), {
          ...options,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorMsg = `API Error: ${response.status} ${response.statusText}`;
          try {
            const errData = await response.json();
            if (errData.error || errData.message) {
              errorMsg = errData.error || errData.message;
            }
          } catch (e) {
            // Ignore if not json
          }
          throw new Error(errorMsg);
        }

        let data;
        const text = await response.text();
        try {
           data = text ? JSON.parse(text) : {};
        } catch (e) {
           throw new Error(`Parse error. Server returned: ${text.substring(0, 50)}...`);
        }

        if (!options.skipCache && (!options.method || options.method === "GET")) {
          cache.set(cacheKey, { data, expiry: Date.now() + CACHE_TTL });
        }

        return data;
      } catch (error: any) {
        lastError = error;
        // Don't retry on 4xx errors
        if (error.message && error.message.includes("API Error: 4")) {
           break;
        }
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries - 1) {
           await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, attempt)));
        }
      }
    }
    pendingRequests.delete(cacheKey);
    throw lastError;
  })();

  if (!options.skipCache && (!options.method || options.method === "GET")) {
    pendingRequests.set(cacheKey, requestPromise);
  }

  return requestPromise;
};

export const wooService = {
  clearCache: () => {
    cache.clear();
    pendingRequests.clear();
    localStorage.removeItem(PRODUCTS_CACHE_KEY);
  },

  // 1. Get Cached Products (LocalStorage Sync)
  getCachedProducts: (): Product[] | null => {
    const cached = localStorage.getItem(PRODUCTS_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Return regardless of expiry for SWR
        return parsed.data;
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  getProducts: async (
    params: {
      category?: number;
      search?: string;
      min_price?: string;
      max_price?: string;
      orderby?: string;
      order?: string;
      tag?: number;
      per_page?: number;
    } = {},
  ): Promise<Product[]> => {
    const queryParams: Record<string, string> = {
      per_page: (params.per_page || 50).toString(),
      ...(params.category && { category: params.category.toString() }),
      ...(params.tag && { tag: params.tag.toString() }),
      ...(params.search && { search: params.search }),
      ...(params.min_price && { min_price: params.min_price }),
      ...(params.max_price && { max_price: params.max_price }),
      ...(params.orderby && { orderby: params.orderby }),
      ...(params.order && { order: params.order }),
    };

    const isDefaultQuery =
      !params.category &&
      !params.search &&
      !params.min_price &&
      !params.max_price &&
      (!params.orderby || params.orderby === "date");

    const products = await request<Product[]>("/products", {
      params: queryParams,
    });

    // Update Persistent Cache only for default view
    if (isDefaultQuery && products.length > 0) {
      localStorage.setItem(
        PRODUCTS_CACHE_KEY,
        JSON.stringify({
          data: products,
          timestamp: Date.now(),
        }),
      );
    }

    return products;
  },

  getProduct: async (id: number): Promise<Product> => {
    return request<Product>(`/products/${id}`);
  },

  createProduct: async (data: any): Promise<Product> => {
    return request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(data),
      skipCache: true,
    });
  },

  updateProduct: async (id: number, data: any): Promise<Product> => {
    cache.delete(`${window.location.origin}/api/woo/wp-json/wc/v3/products/${id}`);
    return request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      skipCache: true,
    });
  },

  deleteProduct: async (id: number): Promise<void> => {
    return request<void>(`/products/${id}`, {
      method: "DELETE",
      params: { force: "true" },
      skipCache: true,
    });
  },

  getCategories: async (): Promise<Category[]> => {
    return request<Category[]>("/products/categories", {
      params: { per_page: "20", hide_empty: "true" },
    });
  },

  getPosts: async (page: number = 1, per_page: number = 3): Promise<Post[]> => {
    return request<Post[]>(`/posts`, {
      params: { per_page: per_page.toString(), page: page.toString(), _embed: "1" },
      isWpApi: true,
    });
  },

  getOrders: async (
    params: {
      customer?: number;
      per_page?: number;
      page?: number;
      status?: string;
    } = {},
  ): Promise<Order[]> => {
    const queryParams: Record<string, string> = {
      per_page: (params.per_page || 20).toString(),
      ...(params.page && { page: params.page.toString() }),
      ...(params.customer && { customer: params.customer.toString() }),
      ...(params.status && { status: params.status }),
    };
    return request<Order[]>("/orders", {
      params: queryParams,
      skipCache: true,
    });
  },

  getOrder: async (id: number): Promise<Order> => {
    return request<Order>(`/orders/${id}`, { skipCache: true });
  },

  createOrder: async (orderData: CreateOrderPayload): Promise<Order> => {
    return request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
      skipCache: true,
    });
  },

  updateOrder: async (orderId: number, status: string): Promise<void> => {
    return request<void>(`/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
      skipCache: true,
    });
  },

  createOrderNote: async (orderId: number, note: string): Promise<void> => {
    return request<void>(`/orders/${orderId}/notes`, {
      method: "POST",
      body: JSON.stringify({ note }),
      skipCache: true,
    });
  },

  getAppContent: async (): Promise<any> => {
    try {
      const products = await request<any[]>(
        "/products?sku=app-config-content-v1",
        { skipCache: true, timeout: 15000 },
      );
      if (products && products.length > 0) {
        const raw = products[0].description;
        // strip HTML if any, decode HTML entities
        const clean = raw.replace(/<[^>]+>/g, "").replace(/&quot;/g, '"');
        return JSON.parse(clean);
      }
    } catch (e: any) {
      if (e.message !== "Request timed out" && !e.message?.includes('504')) {
        // console.warn("Failed to fetch app content from wooService:", e.message);
      }
    }
    return null;
  },

  updateAppContent: async (content: any): Promise<boolean> => {
    try {
      const jsonStr = JSON.stringify(content);
      const products = await request<any[]>(
        "/products?sku=app-config-content-v1",
        { skipCache: true },
      );

      if (products && products.length > 0) {
        await request(`/products/${products[0].id}`, {
          method: "PUT",
          body: JSON.stringify({ description: jsonStr }),
        });
      } else {
        await request(`/products`, {
          method: "POST",
          body: JSON.stringify({
            name: "App Config Content",
            description: jsonStr,
            status: "private",
            sku: "app-config-content-v1",
            catalog_visibility: "hidden",
          }),
        });
      }
      return true;
    } catch (e) {
      console.error("Failed to save app content to wooService", e);
      return false;
    }
  },

  getLandingProduct: async (): Promise<any> => {
    try {
      const categories = await wooService.getCategories();
      const landingCategory = categories.find((c: any) => c.slug === 'landing' || c.name === 'landing' || c.name === 'لندینگ');
      
      let products = [];
      if (landingCategory) {
        products = await wooService.getProducts({ category: landingCategory.id, per_page: 1 });
      } else {
        products = await wooService.getProducts({ per_page: 20 });
        products = products.filter((p: any) => p.categories?.some((c: any) => c.slug === 'landing' || c.name === 'landing'));
      }
      
      if (products && products.length > 0) {
        return products[0];
      }
    } catch(e) {
      // silent fallback
    }
    return null;
  },

  deleteOrder: async (orderId: number): Promise<void> => {
    return request<void>(`/orders/${orderId}`, {
      method: "DELETE",
      params: { force: "true" },
      skipCache: true,
    });
  },
};
