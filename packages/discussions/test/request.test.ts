import { request } from "../src/request";
import * as utils from "../src/utils/request";
import * as fetchMock from "fetch-mock";
import { IAuthenticationManager } from "@esri/arcgis-rest-request";

describe("request", () => {
  const url = "foo";
  const options = {};
  it("resolves token before making api request", done => {
    const token = "thisisatoken";
    const authenticateRequestSpy = spyOn(
      utils,
      "authenticateRequest"
    ).and.callFake(async () => token);
    const apiRequestSpy = spyOn(utils, "apiRequest");

    request(url, options)
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
      .authenticateRequest(options)
      .then(() => {
        expect(getTokenSpy).not.toHaveBeenCalled();
        done();
      })
      .catch(() => fail());
  });

  it("resolves token from authentication", done => {
    const options = { authentication };
    utils
      .authenticateRequest(options)
      .then(() => {
        expect(getTokenSpy).toHaveBeenCalledWith(portal);
        done();
      })
      .catch(() => fail());
  });
});

describe("apiRequest", () => {
  const response = { ok: true };

  const urlBase = "http://localhost/api/v1";
  const url = "foo";

  let expectedOpts: RequestInit;
  beforeEach(() => {
    fetchMock.mock("*", { status: 200, body: response });

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    expectedOpts = {
      headers,
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include"
    } as RequestInit;
  });

  afterEach(fetchMock.restore);

  it("appends headers to request options", async () => {
    const result = await utils.apiRequest(url, {});

    expect(result).toEqual(response);

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([urlBase, url].join("/"));
    expect(calledOpts).toEqual(expectedOpts);
  });

  it("uses apiBaseUrl when supplied", async () => {
    const apiBaseUrl = "https://someotherurl.com";

    const result = await utils.apiRequest(url, { apiBaseUrl });

    expect(result).toEqual(response);

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([apiBaseUrl, url].join("/"));
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`appends token header to request options if supplied`, async () => {
    const token = "bar";

    const result = await utils.apiRequest(url, {}, token);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);
    expectedOpts.headers = headers;

    expect(result).toEqual(response);

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([urlBase, url].join("/"));
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`appends query params to url if supplied`, async () => {
    const query = {
      bar: "baz"
    };
    const options = { params: { query } };

    const result = await utils.apiRequest(url, options);

    expect(result).toEqual(response);
    const queryParams = new URLSearchParams(query).toString();
    const baseUrl = [urlBase, url].join("/");

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual(baseUrl + `?${queryParams}`);
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`stringifies and appends body to request options if supplied`, async () => {
    const body = {
      bar: "baz"
    };
    const options = { params: { body } };

    const result = await utils.apiRequest(url, options);

    expectedOpts.body = JSON.stringify(body);

    expect(result).toEqual(response);

    const [calledUrl, calledOpts] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([urlBase, url].join("/"));
    expect(calledOpts).toEqual(expectedOpts);
  });
});
