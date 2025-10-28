import { describe, it, expect, afterEach, vi } from "vitest";
import { ISearchOptions } from "@esri/arcgis-rest-portal";
import { IHubSearchResponse } from "../../../src/search/types/IHubSearchResponse";
import { getNextPortalCallback } from "../../../src/search/_internal/commonHelpers/getNextPortalCallback";
import { IHubSearchResult } from "../../../src/search/types/IHubSearchResult";
import { MOCK_AUTH } from "../../mocks/mock-auth";

describe("getNextPortalCallback:", () => {
  afterEach(() => vi.restoreAllMocks());

  it("handles no auth", async () => {
    const request = {} as unknown as ISearchOptions;

    const Module = {
      fn: <I, O>(_r: I): Promise<IHubSearchResponse<O>> => {
        return Promise.resolve({} as unknown as IHubSearchResponse<O>);
      },
    };
    const fnSpy = vi.spyOn(Module as any, "fn").mockImplementation(() => {
      return Promise.resolve({} as unknown as IHubSearchResponse<any>);
    });

    const chk = getNextPortalCallback<ISearchOptions, IHubSearchResult>(
      request,
      10,
      20,
      fnSpy as unknown as any
    );
    await chk();
    expect(fnSpy).toHaveBeenCalled();
    // verify it's not called with an authentication
    const opts = (fnSpy as unknown as any).mock.calls[
      (fnSpy as unknown as any).mock.calls.length - 1
    ][0];
    expect(opts.authentication).toBeUndefined();
    expect(opts.start).toBe(10);
  });
  it("uses auth on subsequent calls", async () => {
    const request = {
      authentication: MOCK_AUTH,
      requestOptions: {
        authentication: MOCK_AUTH,
      },
    } as unknown as ISearchOptions;

    const Module = {
      fn: <I, O>(_r: I): Promise<IHubSearchResponse<O>> => {
        return Promise.resolve({} as unknown as IHubSearchResponse<O>);
      },
    };
    const fnSpy = vi.spyOn(Module as any, "fn").mockImplementation(() => {
      return Promise.resolve({} as unknown as IHubSearchResponse<any>);
    });

    const chk = getNextPortalCallback<ISearchOptions, IHubSearchResult>(
      request,
      10,
      20,
      fnSpy as unknown as any
    );
    await chk();
    expect(fnSpy).toHaveBeenCalled();
    // verify it's called with the MOCK_AUTH
    const opts = (fnSpy as unknown as any).mock.calls[
      (fnSpy as unknown as any).mock.calls.length - 1
    ][0];
    // once the test started using a mock authentication instead of an actual instance
    // I had to add the .token to the check below b/c comparing the entire object failed
    expect(opts.authentication.token).toEqual(MOCK_AUTH.token);
    expect(opts.requestOptions.authentication.token).toEqual(MOCK_AUTH.token);
    expect(opts.start).toBe(10);
  });
  it("handles negative 'nextStart'", async () => {
    const request = {} as unknown as ISearchOptions;

    const Module = {
      fn: <I, O>(_r: I): Promise<IHubSearchResponse<O>> => {
        return Promise.resolve({} as unknown as IHubSearchResponse<O>);
      },
    };
    const fnSpy = vi.spyOn(Module as any, "fn").mockImplementation(() => {
      return Promise.resolve({} as unknown as IHubSearchResponse<any>);
    });

    const chk = getNextPortalCallback<ISearchOptions, IHubSearchResult>(
      request,
      -1,
      20,
      fnSpy as unknown as any
    );
    await chk();
    expect(fnSpy).toHaveBeenCalled();
    // verify it's not called with an authentication
    const opts = (fnSpy as unknown as any).mock.calls[
      (fnSpy as unknown as any).mock.calls.length - 1
    ][0];
    expect(opts.authentication).toBeUndefined();
    expect(opts.start).toBe(21);
  });
});
