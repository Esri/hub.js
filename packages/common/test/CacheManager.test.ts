import { CacheManager } from "../src";

async function fakeAsyncFn(payload: any): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return payload;
}

function fakeFn(payload: any): any {
  return payload;
}

describe("CacheManager:", () => {
  afterEach(() => {
    // Reset the cache
    CacheManager.reset();
  });
  it("Caches Async Functions by string arg", async () => {
    // fire off a few calls
    const restuls = await Promise.all([
      CacheManager.call(fakeAsyncFn, "one"),
      CacheManager.call(fakeAsyncFn, "two"),
      CacheManager.call(fakeAsyncFn, "one"),
      CacheManager.call(fakeAsyncFn, "one"),
      CacheManager.call(fakeAsyncFn, "one"),
      CacheManager.call(fakeAsyncFn, "two"),
      CacheManager.call(fakeAsyncFn, "three"),
    ]);
    // check the hits and requests
    expect(CacheManager.instance.hits).toBe(4);
    expect(CacheManager.instance.requests).toBe(7);
    expect(CacheManager.stats).toBe(`Cache used for 4 out of 7 calls`);
  });
  it("Caches Async Functions by string arg", async () => {
    // fire off a few calls
    const restuls = await Promise.all([
      CacheManager.call(fakeAsyncFn, { a: "one" }),
      CacheManager.call(fakeAsyncFn, { a: "two" }),
      CacheManager.call(fakeAsyncFn, { a: "one" }),
      CacheManager.call(fakeAsyncFn, { a: "one" }),
      CacheManager.call(fakeAsyncFn, { a: "one" }),
      CacheManager.call(fakeAsyncFn, { a: "two" }),
      CacheManager.call(fakeAsyncFn, { a: "three" }),
    ]);
    // check the hits and requests
    expect(CacheManager.instance.hits).toBe(4);
    expect(CacheManager.instance.requests).toBe(7);
  });
  it("Caches non-async functions", () => {
    CacheManager.call(fakeFn, { a: "one" });
    CacheManager.call(fakeFn, { a: "two" });
    CacheManager.call(fakeFn, { a: "one" });
    CacheManager.call(fakeFn, { a: "one" });
    CacheManager.call(fakeFn, { a: "one" });
    CacheManager.call(fakeFn, { a: "two" });
    CacheManager.call(fakeFn, { a: "three" });

    expect(CacheManager.instance.hits).toBe(4);
    expect(CacheManager.instance.requests).toBe(7);
  });
});
