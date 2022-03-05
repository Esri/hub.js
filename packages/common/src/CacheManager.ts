/**
 * Singleton Cache Manager
 */
export class CacheManager {
  private static _instance: CacheManager;
  public hits: number = 0;
  public requests: number = 0;
  private cache: Map<string, unknown>;

  private constructor() {
    this.cache = new Map<string, unknown>();
  }

  /**
   * Convenience static method that directs calls to the instance
   * @param fn
   * @param args
   * @returns
   */
  public static async call<Fn extends (...args: any) => any>(
    fn: (...args: any[]) => ReturnType<Fn>,
    ...args: any[]
  ): Promise<ReturnType<Fn>> {
    return CacheManager.instance.callFn(fn, ...args);
  }

  /**
   * Reset the cache
   */
  public static reset() {
    CacheManager.instance.cache = new Map<string, unknown>();
    CacheManager.instance.hits = 0;
    CacheManager.instance.requests = 0;
  }

  /**
   * Stringify arguments into a key
   * Although map can use objects as keys, that requires sending
   * the same refs for multiple calls. Converting to strings allows
   * caching of the effective request without requiring the same ref
   * @param args
   * @returns
   */
  private createCacheKey(args: any[]): string {
    return args.reduce(
      (cacheKey, arg) =>
        (cacheKey += `_${
          typeof arg === "object" ? JSON.stringify(args) : `${arg}`
        }_`),
      ""
    );
  }

  static get instance(): CacheManager {
    if (!this._instance) {
      this._instance = new CacheManager();
    }
    return this._instance;
  }

  /**
   * Cache a function call based on the args passed in
   * @param fn
   * @param args
   * @returns
   */
  private async callFn<Fn extends (...args: any) => any>(
    fn: (...args: any[]) => ReturnType<Fn>,
    ...args: any[]
  ): Promise<ReturnType<Fn>> {
    const cacheKey = this.createCacheKey(args);
    this.requests++;
    if (this.cache.has(cacheKey)) {
      this.hits++;
      // since the cache contains the actual promises
      // we can just return it directly
      return this.cache.get(cacheKey) as ReturnType<Fn>;
    } else {
      // to allow for parallel requests, we don't cache the
      // response, rather we cache the the promise itself
      const fnPromise = fn.apply(null, args);
      this.cache.set(cacheKey, fnPromise);
      // and return it
      return fnPromise;
    }
  }

  /**
   * Return summary of cache hits as string
   * @returns
   */
  public static get stats(): string {
    return `Cache used for ${CacheManager.instance.hits} out of ${CacheManager.instance.requests} calls`;
  }
}
