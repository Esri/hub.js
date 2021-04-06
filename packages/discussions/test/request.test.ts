import { request } from "../src/request";
import * as utils from "../src/utils/request";
import * as fetchMock from "fetch-mock";
import { IAuthenticationManager } from "@esri/arcgis-rest-request";
import { IHubRequestOptions } from "../src/types";

describe("request", () => {
  const url = "foo";
  const options = { params: { foo: "bar" } };
  it("resolves token before making api request", done => {
    const token = "thisisatoken";
    const authenticateRequestSpy = spyOn(
      utils,
      "authenticateRequest"
    ).and.callFake(async () => token);
    const apiRequestSpy = spyOn(utils, "apiRequest");

    request(url, (options as unknown) as IHubRequestOptions)
      .then(() => {
        expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
        expect(apiRequestSpy).toHaveBeenCalledWith(url, options, token);
        done();
      })
      .catch(() => fail());
  });
});

describe("authenticateRequest", () => {
  const portal = "https://foo.com";
  const token = "thisisatoken";
  const authentication: IAuthenticationManager = {
    portal,
    getToken() {
      return Promise.resolve(token);
    }
  };

  let getTokenSpy: any;
  beforeEach(() => {
    getTokenSpy = spyOn(authentication, "getToken").and.callThrough();
  });

  it("returns promise resolving token if token provided in request options", done => {
    const options = { token };
    utils
      .authenticateRequest(options as IHubRequestOptions)
      .then(() => {
        expect(getTokenSpy).not.toHaveBeenCalled();
        done();
      })
      .catch(() => fail());
  });

  it("resolves token from authentication", done => {
    const options = { authentication };
    utils
      .authenticateRequest(options as IHubRequestOptions)
      .then(() => {
        expect(getTokenSpy).toHaveBeenCalledWith(portal);
        done();
      })
      .catch(() => fail());
  });
});

describe("apiRequest", () => {
  const response = { ok: true };

  const hubApiUrl = "https://ingress.eks.qa.hub.geocloud.com/api/v1";
  const url = "foo";

  let expectedOpts: RequestInit;
  let opts: IHubRequestOptions;

  beforeEach(() => {
    fetchMock.mock("*", { status: 200, body: response });

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    expectedOpts = {
      headers,
      method: "GET",
      mode: undefined,
      cache: undefined,
      credentials: undefined
    } as RequestInit;

    opts = { hubApiUrl } as IHubRequestOptions;
  });

  afterEach(fetchMock.restore);

  it("appends headers to request options", async () => {
    const result = await utils.apiRequest(url, opts);

    expect(result).toEqual(response);

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([hubApiUrl, url].join("/"));
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`appends token header to request options if supplied`, async () => {
    const token = "bar";

    const result = await utils.apiRequest(url, opts, token);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);
    expectedOpts.headers = headers;

    expect(result).toEqual(response);

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([hubApiUrl, url].join("/"));
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`appends query params to url if GET`, async () => {
    const query = {
      bar: "baz"
    };
    const options = { ...opts, params: query, httpMethod: "GET" };

    const result = await utils.apiRequest(url, options as IHubRequestOptions);

    expect(result).toEqual(response);
    const queryParams = new URLSearchParams(query).toString();
    const baseUrl = [hubApiUrl, url].join("/");

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual(baseUrl + `?${queryParams}`);
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`stringifies and appends body to request options !GET`, async () => {
    const body = {
      bar: "baz"
    };
    const options = { ...opts, params: body, httpMethod: "POST" };

    const result = await utils.apiRequest(url, options as IHubRequestOptions);

    expectedOpts.method = "POST";
    expectedOpts.body = JSON.stringify(body);

    expect(result).toEqual(response);

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([hubApiUrl, url].join("/"));
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`cleans up baseUrl and enpoint`, async () => {
    const options = { ...opts, hubApiUrl: `${hubApiUrl}/` };
    const result = await utils.apiRequest(
      `/${url}`,
      options as IHubRequestOptions
    );

    expect(result).toEqual(response);

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([hubApiUrl, url].join("/"));
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`uses default hubApiUrl if none provided`, async () => {
    const options = {};
    const result = await utils.apiRequest(url, options as IHubRequestOptions);

    expect(result).toEqual(response);

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([hubApiUrl, url].join("/"));
    expect(calledOpts).toEqual(expectedOpts);
  });
});
