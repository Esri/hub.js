import * as fetchMock from "fetch-mock";
import { IHubRequestOptions } from "@esri/hub-common";
import {
  comingSoon,
  getContent,
} from "../src/index";
import * as portalModule from '../src/portal'
import * as hubModule from "../src/hub";
import { mockUserSession } from "./test-helpers/fake-user-session";

describe("get content", () => {
  let requestOpts: IHubRequestOptions;
  beforeEach(() => {
    requestOpts = {
      portalSelf: {
        user: {},
        id: "123",
        isPortal: true,
        name: "some-portal"
      },
      isPortal: true,
      hubApiUrl: "https://some.url.com/",
      authentication: mockUserSession
    };
  });
  afterEach(fetchMock.restore);
  describe("from hub", () => {
    it("should call getContentFromHub", done => {
      requestOpts.isPortal = false;
      requestOpts.portalSelf.isPortal = false;
      const id = 'foo';
      const getContentFromHubSpy = spyOn(hubModule, 'getContentFromHub').and.returnValue(Promise.resolve({}))
      getContent(id, requestOpts)
      .then(() => {
        expect(getContentFromHubSpy.calls.count()).toBe(1)
        expect(getContentFromHubSpy.calls.argsFor(0)).toEqual(['foo', requestOpts])
        done()
      })
    });
  });
  describe("from portal", () => {
    it("should call getContentFromPortal", done => {
      const id = 'foo';
      const getContentFromPortalSpy = spyOn(portalModule, 'getContentFromPortal').and.returnValue(Promise.resolve({}))
      getContent(id, requestOpts)
      .then(() => {
        expect(getContentFromPortalSpy.calls.count()).toBe(1)
        expect(getContentFromPortalSpy.calls.argsFor(0)).toEqual(['foo', requestOpts])
        done()
      })
    });
  });
});

// TODO: remove this next major release
describe("what's currently here, which aint much", () => {
  afterEach(fetchMock.restore);
  it("should make an item request w/o fetching data", done => {
    fetchMock.once("*", { the: "goods" });
    comingSoon()
      .then(response => {
        const [url, options] = fetchMock.calls()[0];
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.body).toContain("f=json");
        expect(response.the).toEqual("goods");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
