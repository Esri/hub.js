import { CacheManager } from "../src";

async function fakeAsyncFn(payload: any): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return payload;
}

async function fakeAsyncFn2(payload: any): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  payload.foo = "bar";
  return payload;
}

function fakeFn(payload: any): any {
  return payload;
}

function fakeFn2(payload: any): any {
  payload.foo = "bar";
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
  it("Caches non-async functions", async () => {
    const results = await Promise.all([
      CacheManager.call(fakeFn, { a: "one" }),
      CacheManager.call(fakeFn, { a: "two" }),
      CacheManager.call(fakeFn, { a: "one" }),
      CacheManager.call(fakeFn, { a: "one" }),
      CacheManager.call(fakeFn, { a: "one" }),
      CacheManager.call(fakeFn, { a: "two" }),
      CacheManager.call(fakeFn, { a: "three" }),
    ]);

    expect(results[0]).toBe(results[2]);
    expect(CacheManager.instance.hits).toBe(4);
    expect(CacheManager.instance.requests).toBe(7);
  });
  it("does not mix cache responses from different functions taking the same args", async () => {
    const r1 = await CacheManager.call(fakeAsyncFn, { a: "one" });
    const r2 = await CacheManager.call(fakeAsyncFn2, { a: "one" });
    const r3 = await CacheManager.call(fakeAsyncFn2, { a: "one" });
    expect(r1).not.toEqual(r2);
    expect(r2.foo).toEqual("bar");
    expect(r3).toEqual(r2);
  });
  it("throws for anonymous functions", async () => {
    try {
      await CacheManager.call((x) => x + 1, 10);
    } catch (ex) {
      expect(ex.message).toBe(
        "CacheManager is not reliable with anonymous functions. Please use a named function."
      );
    }
  });
});
