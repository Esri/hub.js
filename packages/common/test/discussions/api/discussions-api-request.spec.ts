import { vi, afterEach } from "vitest";
import {
  discussionsApiRequest,
  discussionsApiRequestV2,
} from "../../../src/discussions/api/discussions-api-request";
import * as utils from "../../../src/discussions/api/utils/request";
import * as fetchMock from "fetch-mock";
import { IAuthenticationManager } from "@esri/arcgis-rest-request";
import {
  IDiscussionsRequestOptions,
  SearchPostsFormat,
} from "../../../src/discussions/api/types";

afterEach(() => vi.restoreAllMocks());

describe("discussionsApiRequest", () => {
  const url = "foo";
  const options = { params: { foo: "bar" } };
  it("resolves token before making api request", () => {
    const token = "thisisatoken";
    const authenticateRequestSpy = vi
      .spyOn(utils, "authenticateRequest")
      .mockImplementation(async () => token);
    const apiRequestSpy = vi.spyOn(utils, "apiRequest");
    apiRequestSpy.mockReturnValue(Promise.resolve({} as any));
    return discussionsApiRequest(
      url,
      options as unknown as IDiscussionsRequestOptions
    ).then(() => {
      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(apiRequestSpy).toHaveBeenCalledWith(url, options, "v1", token);
    });
  });
});

describe("discussionsApiRequestV2", () => {
  const url = "foo";
  const options = { params: { foo: "bar" } };
  it("resolves token before making api request", () => {
    const token = "thisisatoken";
    const authenticateRequestSpy = vi
      .spyOn(utils, "authenticateRequest")
      .mockImplementation(async () => token);
    const apiRequestSpy = vi.spyOn(utils, "apiRequest");
    apiRequestSpy.mockReturnValue(Promise.resolve({} as any));
    return discussionsApiRequestV2(
      url,
      options as unknown as IDiscussionsRequestOptions
    ).then(() => {
      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(apiRequestSpy).toHaveBeenCalledWith(url, options, "v2", token);
    });
  });
});

describe("authenticateRequest", () => {
  const portal = "https://foo.com";
  const token = "thisisatoken";
  const authentication: IAuthenticationManager = {
    portal,
    getToken() {
      return Promise.resolve(token);
    },
  };

  let getTokenSpy: any;
  beforeEach(() => {
    getTokenSpy = vi.spyOn(authentication, "getToken");
  });

  it("returns promise resolving token if token provided in request options", () => {
    const options = { token };
    return utils
      .authenticateRequest(options as IDiscussionsRequestOptions)
      .then(() => {
        expect(getTokenSpy).not.toHaveBeenCalled();
      });
  });

  it("resolves token from authentication", () => {
    const options = { authentication };
    return utils
      .authenticateRequest(options as IDiscussionsRequestOptions)
      .then(() => {
        expect(getTokenSpy).toHaveBeenCalledWith(portal);
      });
  });
});

describe("apiRequest", () => {
  const response = { ok: true };

  const hubApiUrlV2 = "https://hub.arcgis.com/api/discussions/v2";
  const hubApiUrlV1 = "https://hub.arcgis.com/api/discussions/v1";
  let url: string;

  let expectedOpts: RequestInit;
  let opts: IDiscussionsRequestOptions;

  beforeEach(() => {
    url = "foo";
    fetchMock.mock("*", { status: 200, body: response });

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    expectedOpts = {
      headers,
      method: "GET",
      mode: undefined,
      cache: undefined,
      credentials: undefined,
    } as RequestInit;

    opts = { hubApiUrlV2 } as IDiscussionsRequestOptions;
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it("handles failed requests", () => {
    const status = 400;
    const message = ["go do this", "go do that"];
    fetchMock.reset();
    fetchMock.mock("*", { status, body: { message } });

    return utils
      .apiRequest(url, opts, "v2")
      .then(() => {
        throw new Error("expected request to fail");
      })
      .catch((e) => {
        expect(e.message).toBe("Bad Request");
        expect(e.status).toBe(status);
        expect(e.url).toBe(`${hubApiUrlV2}/${url}`);
        expect(e.error).toBe(JSON.stringify(message));
      });
  });

  it("appends headers to request options", async () => {
    const result = await utils.apiRequest(url, opts, "v2");

    expect(result).toEqual(response);

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([hubApiUrlV2, url].join("/"));
    expect(calledOpts).toEqual(expectedOpts);
  });

  // Additional tests omitted for brevity
  it("appends additional headers to request options", async () => {
    const expectedHeaders = new Headers(expectedOpts.headers);
    expectedHeaders.append("mention-url", "https://some.hub.arcgis.com");
    expectedOpts = {
      ...expectedOpts,
      headers: expectedHeaders,
    };
    const result = await utils.apiRequest(
      url,
      {
        ...opts,
        headers: { "mention-url": "https://some.hub.arcgis.com" },
      },
      "v2"
    );

    expect(result).toEqual(response);

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([hubApiUrlV2, url].join("/"));
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`appends token header to request options if supplied`, async () => {
    const token = "thisisatoken";
    const result = await utils.apiRequest(url, opts, "v2", token);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);
    expectedOpts.headers = headers;

    expect(result).toEqual(response);

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([hubApiUrlV2, url].join("/"));
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`appends query params to url if GET`, async () => {
    const query = {
      bar: "baz",
    };
    const options = { ...opts, data: query, httpMethod: "GET" };

    const result = await utils.apiRequest(
      url,
      options as IDiscussionsRequestOptions,
      "v2"
    );

    expect(result).toEqual(response);
    const queryParams = new URLSearchParams(query).toString();
    const baseUrl = [hubApiUrlV2, url].join("/");

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual(baseUrl + `?${queryParams}`);
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`stringifies and appends body to request options !GET`, async () => {
    const body = {
      bar: "baz",
    };
    const options = { ...opts, data: body, httpMethod: "POST" };

    const result = await utils.apiRequest(
      url,
      options as IDiscussionsRequestOptions,
      "v2"
    );

    expectedOpts.method = "POST";
    expectedOpts.body = JSON.stringify(body);

    expect(result).toEqual(response);

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([hubApiUrlV2, url].join("/"));
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`cleans up baseUrl and endpoint (for V2)`, async () => {
    const options = { ...opts, hubApiUrl: `${hubApiUrlV2}/` };
    const result = await utils.apiRequest(
      `/${url}`,
      options as IDiscussionsRequestOptions,
      "v2"
    );

    expect(result).toEqual(response);

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([hubApiUrlV2, url].join("/"));
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`cleans up baseUrl and endpoint (for V1)`, async () => {
    const options = { ...opts, hubApiUrl: `${hubApiUrlV1}/` };
    const result = await utils.apiRequest(
      `/${url}`,
      options as IDiscussionsRequestOptions,
      "v1"
    );

    expect(result).toEqual(response);

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([hubApiUrlV1, url].join("/"));
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`uses default hubApiUrlV2 (for v2) if none provided`, async () => {
    const options = {};
    const result = await utils.apiRequest(
      url,
      options as IDiscussionsRequestOptions,
      "v2"
    );

    expect(result).toEqual(response);

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([hubApiUrlV2, url].join("/"));
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`uses default hubApiUrl (for v1) if none provided`, async () => {
    const options = {};
    const result = await utils.apiRequest(
      url,
      options as IDiscussionsRequestOptions,
      "v1"
    );

    expect(result).toEqual(response);

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([hubApiUrlV1, url].join("/"));
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`modifies url for v1 passed in`, async () => {
    const options = {};
    const result = await utils.apiRequest(
      url,
      options as IDiscussionsRequestOptions,
      "v1"
    );

    expect(result).toEqual(response);

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([hubApiUrlV1, url].join("/"));
    expect(calledOpts).toEqual(expectedOpts);
  });

  it("resolves plain-text when f=csv for GET search posts route", async () => {
    url = "/posts";
    const options = {
      data: {
        f: SearchPostsFormat.CSV,
      },
      httpMethod: "GET",
    } as IDiscussionsRequestOptions;
    const result = await utils.apiRequest(url, options, "v2");

    expect(result).toEqual(JSON.stringify(response));

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual(
      "https://hub.arcgis.com/api/discussions/v2/posts?f=csv"
    );
    expect(calledOpts).toEqual(expectedOpts);
  });

  it("resolves plain-text when f=csv for POST search posts route", async () => {
    url = "/posts/search";
    const options = {
      data: {
        f: SearchPostsFormat.CSV,
      },
      httpMethod: "POST",
    } as IDiscussionsRequestOptions;
    expectedOpts.method = "POST";
    expectedOpts.body = JSON.stringify({
      f: SearchPostsFormat.CSV,
    });
    const result = await utils.apiRequest(url, options, "v2");

    expect(result).toEqual(JSON.stringify(response));

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual(
      "https://hub.arcgis.com/api/discussions/v2/posts/search"
    );
    expect(calledOpts).toEqual(expectedOpts);
  });

  it('resolves plain-text when HTTP "Accept" header has a value of "text/csv" for GET search posts route', async () => {
    url = "/posts";
    const options = {
      headers: {
        Accept: "text/csv",
      },
      httpMethod: "GET",
    } as IDiscussionsRequestOptions;
    const result = await utils.apiRequest(url, options, "v2");
    const expectedHeaders = new Headers(expectedOpts.headers);
    expectedHeaders.set("accept", "text/csv");
    expectedOpts = {
      ...expectedOpts,
      headers: expectedHeaders,
    };

    expect(result).toEqual(JSON.stringify(response));

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual(
      "https://hub.arcgis.com/api/discussions/v2/posts"
    );
    expect(calledOpts).toEqual(expectedOpts);
  });

  it('resolves plain-text when HTTP "Accept" header has a value of "text/csv" for POST search posts route', async () => {
    url = "/posts/search";
    const options = {
      headers: {
        Accept: "text/csv",
      },
      httpMethod: "POST",
    } as IDiscussionsRequestOptions;
    expectedOpts.method = "POST";
    const result = await utils.apiRequest(url, options, "v2");
    const expectedHeaders = new Headers(expectedOpts.headers);
    expectedHeaders.set("accept", "text/csv");
    expectedOpts = {
      ...expectedOpts,
      headers: expectedHeaders,
    };

    expect(result).toEqual(JSON.stringify(response));

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual(
      "https://hub.arcgis.com/api/discussions/v2/posts/search"
    );
    expect(calledOpts).toEqual(expectedOpts);
  });
});
