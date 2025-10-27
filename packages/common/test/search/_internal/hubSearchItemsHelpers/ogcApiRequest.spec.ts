import { describe, it, expect, vi, afterEach } from "vitest";
import { ogcApiRequest } from "../../../../src/search/_internal/hubSearchItemsHelpers/ogcApiRequest";
import { RemoteServerError } from "../../../../src/request";

describe("ogcApiRequest", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws RemoteServerError when response.ok is false", async () => {
    const fakeFetch = vi
      .fn()
      .mockResolvedValue({ ok: false, status: 502, statusText: "Bad Gateway" });
    const url = "https://example.com?q=1";
    const params: any = { q: "x" };
    const options: any = { requestOptions: { fetch: fakeFetch } };

    await expect(ogcApiRequest(url, params, options)).rejects.toBeInstanceOf(
      RemoteServerError
    );
    expect(fakeFetch).toHaveBeenCalled();
  });

  it("uses global fetch when no override provided and returns json", async () => {
    const fakeJson = { ok: true };
    const fakeFetch = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => fakeJson });
    const origFetch = (globalThis as any).fetch;
    (globalThis as any).fetch = fakeFetch;

    const url = "https://example.com";
    const params: any = { q: "1" };
    const options: any = { requestOptions: {} };

    const res = await ogcApiRequest(url, params, options);
    expect(res).toEqual(fakeJson);

    (globalThis as any).fetch = origFetch;
  });
});
import { ogcApiRequest } from "../../../../src/search/_internal/hubSearchItemsHelpers/ogcApiRequest";
import { RemoteServerError } from "../../../../src/request";

describe("ogcApiRequest", () => {
  afterEach(() => vi.restoreAllMocks());

  it("calls fetch from requestOptions and returns json on ok", async () => {
    const fakeJson = { foo: "bar" };
    const fakeFetch = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => fakeJson });

    const res = await ogcApiRequest(
      "https://example.com/ogc",
      { q: "x" } as any,
      { requestOptions: { fetch: fakeFetch } } as any
    );

    expect(fakeFetch).toHaveBeenCalledTimes(1);
    // URL should include query string
    expect(fakeFetch.mock.calls[0][0]).toContain("?");
    expect(res).toEqual(fakeJson);
  });

  it("throws RemoteServerError when response not ok", async () => {
    const fakeFetch = vi
      .fn()
      .mockResolvedValue({ ok: false, status: 500, statusText: "err" });

    await expect(
      ogcApiRequest(
        "https://example.com/ogc",
        { q: "x" } as any,
        { requestOptions: { fetch: fakeFetch } } as any
      )
    ).rejects.toThrow(RemoteServerError);
  });
});
