import { ISearchOptions } from "@esri/arcgis-rest-portal";
import { IHubSearchResponse } from "../../../src/search/types/IHubSearchResponse";
import { getNextPortalCallback } from "../../../src/search/_internal/commonHelpers/getNextPortalCallback";
import { IHubSearchResult } from "../../../src/search/types/IHubSearchResult";
import { MOCK_AUTH } from "../../mocks/mock-auth";

describe("getNextPortalCallback:", () => {
  it("handles no auth", async () => {
    const request = {} as unknown as ISearchOptions;

    const Module = {
      fn: <I, O>(_r: I): Promise<IHubSearchResponse<O>> => {
        return Promise.resolve({} as unknown as IHubSearchResponse<O>);
      },
    };
    const fnSpy = spyOn(Module, "fn").and.callThrough();

    const chk = getNextPortalCallback<ISearchOptions, IHubSearchResult>(
      request,
      10,
      20,
      fnSpy
    );
    await chk();
    expect(fnSpy).toHaveBeenCalled();
    // verify it's not called with an authentication
    const opts = fnSpy.calls.mostRecent().args[0];
    expect(opts.authentication).toBeUndefined();
    expect(opts.start).toBe(10);
  });
  it("uses auth on subsequent calls", async () => {
    const request = {
      authentication: MOCK_AUTH,
    } as unknown as ISearchOptions;

    const Module = {
      fn: <I, O>(_r: I): Promise<IHubSearchResponse<O>> => {
        return Promise.resolve({} as unknown as IHubSearchResponse<O>);
      },
    };
    const fnSpy = spyOn(Module, "fn").and.callThrough();

    const chk = getNextPortalCallback<ISearchOptions, IHubSearchResult>(
      request,
      10,
      20,
      fnSpy
    );
    await chk();
    expect(fnSpy).toHaveBeenCalled();
    // verify it's called with the MOCK_AUTH
    const opts = fnSpy.calls.mostRecent().args[0];
    // once the tests using a mock authentication instead of an actual instance
    // I had to add the .token to the check below b/c comparing the entire object failed
    expect(opts.authentication.token).toEqual(MOCK_AUTH.token);
    expect(opts.start).toBe(10);
  });
  // I don't know why this condition is in the code, but it is. Adding for coverage.
  it("handles negative 'nextStart'", async () => {
    const request = {} as unknown as ISearchOptions;

    const Module = {
      fn: <I, O>(_r: I): Promise<IHubSearchResponse<O>> => {
        return Promise.resolve({} as unknown as IHubSearchResponse<O>);
      },
    };
    const fnSpy = spyOn(Module, "fn").and.callThrough();

    const chk = getNextPortalCallback<ISearchOptions, IHubSearchResult>(
      request,
      -1,
      20,
      fnSpy
    );
    await chk();
    expect(fnSpy).toHaveBeenCalled();
    // verify it's not called with an authentication
    const opts = fnSpy.calls.mostRecent().args[0];
    expect(opts.authentication).toBeUndefined();
    expect(opts.start).toBe(21);
  });
});
