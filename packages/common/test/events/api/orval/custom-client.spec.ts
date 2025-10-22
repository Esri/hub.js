import { describe, it, expect, vi, afterEach } from "vitest";
import { customClient } from "../../../../src/events/api/orval/custom-client";

describe("customClient", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns json when fetch ok", async () => {
    const fakeJson = { hello: "world" };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => fakeJson,
        statusText: "OK",
        status: 200,
      })
    );

    const res = await (customClient as any)(
      { url: "/x", method: "GET" },
      { hubApiUrl: "https://api.test", token: "t1", params: { a: "1" } }
    );

    expect(res).toEqual(fakeJson);
    // ensure fetch was called with the composed URL
    const fetchMock = (globalThis as any).fetch;
    expect(fetchMock).toHaveBeenCalled();
    const calledUrl = fetchMock.mock.calls[0][0];
    expect(String(calledUrl)).toContain("https://api.test/x?");
  });

  it("sends body when data provided and trims trailing slash from hubApiUrl", async () => {
    const fakeJson = { ok: true };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => fakeJson,
        statusText: "OK",
        status: 200,
      })
    );

    const res = await customClient(
      { url: "/x", method: "POST", data: { a: 1 }, headers: { "X-T": "1" } },
      { hubApiUrl: "https://api.test/", token: "t1", headers: { Y: "2" } }
    );

    expect(res).toEqual(fakeJson);
    const fetchMock = (globalThis as any).fetch;
    const calledUrl = fetchMock.mock.calls[0][0];
    expect(String(calledUrl)).toContain("https://api.test/x?");
    const calledOptions = fetchMock.mock.calls[0][1];
    expect(calledOptions.body).toBeDefined();
  });

  it("uses default hubApiUrl when none provided", async () => {
    const fakeJson = { ok: true };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => fakeJson,
        statusText: "OK",
        status: 200,
      })
    );

    const res = await customClient({ url: "/d", method: "GET" }, {} as any);
    expect(res).toEqual(fakeJson);
    const fetchMock = (globalThis as any).fetch;
    const calledUrl = fetchMock.mock.calls[0][0];
    expect(String(calledUrl)).toContain("https://hub.arcgis.com/d?");
  });

  it("throws RemoteServerError when fetch not ok", async () => {
    const fakeErr = { message: "bad" };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => fakeErr,
        statusText: "Bad",
        status: 500,
      })
    );

    await expect(
      customClient(
        { url: "/x", method: "GET" },
        { hubApiUrl: "https://api.test" }
      )
    ).rejects.toMatchObject({ message: "Bad" });
  });
});
