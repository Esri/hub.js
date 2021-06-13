import * as fetchMock from "fetch-mock";
import * as arcgisRestPortal from "@esri/arcgis-rest-portal";
import { IHubRequestOptions, IModel } from "@esri/hub-common";
import { getContent } from "../src/content";
import * as portalModule from "../src/portal";
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
  describe("from IModel", () => {
    let getContentFromHubSpy: jasmine.Spy;
    let getContentFromPortalSpy: jasmine.Spy;
    let getDataSpy: jasmine.Spy;
    beforeEach(() => {
      getContentFromHubSpy = spyOn(hubModule, "getContentFromHub");
      getContentFromPortalSpy = spyOn(portalModule, "getContentFromPortal");

      getDataSpy = spyOn(arcgisRestPortal, "getItemData").and.returnValue(
        Promise.resolve({ from: "api" })
      );
    });

    it("works with just an item", async () => {
      const modelWithItem = {
        item: {
          id: "3ef",
          // important to flag as a type for which data is fetched
          type: "Solution"
        }
      } as IModel;

      // setting isPortal here for hubId check below
      const ro = { isPortal: true } as IHubRequestOptions;

      const content = await getContent(modelWithItem, ro);

      // should not try to fetch content from hub or portal
      expect(getContentFromHubSpy).not.toHaveBeenCalled();
      expect(getContentFromPortalSpy).not.toHaveBeenCalled();

      // should not have set the hubId
      expect(content.hubId).toBeFalsy("don't set hubId in portal");

      // should still load data
      expect(getDataSpy).toHaveBeenCalledWith(modelWithItem.item.id, ro);
      expect(content.data.from).toBe("api", "fetched data from API");
    });
    it("works with item and data", async () => {
      const model = ({
        item: {
          id: "3ef"
        },
        data: { from: "arg" }
      } as unknown) as IModel;

      const ro = {} as IHubRequestOptions;

      const content = await getContent(model, ro);

      expect(content.data.from).toBe(
        "arg",
        "used data from the IModel argument"
      );

      // should not try to fetch content from hub or portal
      expect(getContentFromHubSpy).not.toHaveBeenCalled();
      expect(getContentFromPortalSpy).not.toHaveBeenCalled();

      // should not load data
      expect(getDataSpy).not.toHaveBeenCalled();
    });
  });
  describe("from hub", () => {
    beforeEach(() => {
      requestOpts.isPortal = false;
      requestOpts.portalSelf.isPortal = false;
    });
    describe("with an id", () => {
      const id = "7a153563b0c74f7eb2b3eae8a66f2fbb";
      it("should call getContentFromHub", done => {
        const contentFromHub = {
          id,
          // emulating a hub created web map w/o orgId
          // will force additional fetch for owner's orgId
          hubType: "map",
          type: "Web Map",
          typeKeywords: ["ArcGIS Hub"]
        };
        const getContentFromHubSpy = spyOn(
          hubModule,
          "getContentFromHub"
        ).and.returnValue(Promise.resolve(contentFromHub));
        getContent(id, requestOpts).then(content => {
          expect(getContentFromHubSpy.calls.count()).toBe(1);
          expect(getContentFromHubSpy.calls.argsFor(0)).toEqual([
            id,
            requestOpts
          ]);
          done();
        });
      });
      it("handles private items", done => {
        const getContentFromHubSpy = spyOn(
          hubModule,
          "getContentFromHub"
        ).and.returnValue(Promise.reject({}));
        const getContentFromPortalSpy = spyOn(
          portalModule,
          "getContentFromPortal"
        ).and.returnValue(Promise.resolve({}));
        getContent(id, requestOpts).then(() => {
          expect(getContentFromHubSpy.calls.count()).toBe(1);
          expect(getContentFromHubSpy.calls.argsFor(0)).toEqual([
            id,
            requestOpts
          ]);
          expect(getContentFromPortalSpy.calls.count()).toBe(1);
          expect(getContentFromPortalSpy.calls.argsFor(0)).toEqual([
            id,
            requestOpts
          ]);
          done();
        });
      });
    });
    describe("with a slug", () => {
      const slug = "foo";
      it("rejects when not in the index", done => {
        const err = new Error("test");
        const getContentFromHubSpy = spyOn(
          hubModule,
          "getContentFromHub"
        ).and.returnValue(Promise.reject(err));
        getContent(slug, requestOpts).catch(e => {
          expect(getContentFromHubSpy.calls.count()).toBe(1);
          expect(getContentFromHubSpy.calls.argsFor(0)).toEqual([
            slug,
            requestOpts
          ]);
          expect(e).toEqual(err);
          done();
        });
      });
    });
  });
  describe("from portal", () => {
    it("should call getContentFromPortal", done => {
      const id = "foo";
      const contentFromPortal = {
        id
      };
      const getContentFromPortalSpy = spyOn(
        portalModule,
        "getContentFromPortal"
      ).and.returnValue(Promise.resolve(contentFromPortal));
      getContent(id, requestOpts).then(content => {
        expect(getContentFromPortalSpy.calls.count()).toBe(1);
        expect(getContentFromPortalSpy.calls.argsFor(0)).toEqual([
          "foo",
          requestOpts
        ]);
        done();
      });
    });
  });
});
