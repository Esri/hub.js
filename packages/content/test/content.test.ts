import * as fetchMock from "fetch-mock";
import { IHubContent, IHubRequestOptions, IModel } from "@esri/hub-common";
import { getContent } from "../src/content";
import * as portalModule from "../src/portal";
import * as hubModule from "../src/hub";
import * as enrichmentModule from "../src/enrichments";
import { mockUserSession } from "./test-helpers/fake-user-session";

describe("get content", () => {
  let requestOpts: IHubRequestOptions;
  beforeEach(() => {
    requestOpts = {
      portalSelf: {
        user: {},
        id: "123",
        isPortal: true,
        name: "some-portal",
      },
      isPortal: true,
      hubApiUrl: "https://some.url.com/",
      authentication: mockUserSession,
    };
  });
  afterEach(fetchMock.restore);
  describe("from IModel", () => {
    let getContentFromHubSpy: jasmine.Spy;
    let getContentFromPortalSpy: jasmine.Spy;
    let enrichContentSpy: jasmine.Spy;
    beforeEach(() => {
      getContentFromHubSpy = spyOn(hubModule, "getContentFromHub");
      getContentFromPortalSpy = spyOn(portalModule, "getContentFromPortal");
      enrichContentSpy = spyOn(enrichmentModule, "enrichContent").and.callFake(
        (content: IHubContent) => Promise.resolve(content)
      );
    });

    it("works with just an item in portal", async () => {
      const modelWithItem = {
        item: {
          id: "3ef",
          // important to flag as a type for which data is fetched
          type: "Solution",
        },
      } as IModel;

      // setting isPortal here for hubId check below
      const ro = { isPortal: true } as hubModule.IGetContentOptions;

      const content = await getContent(modelWithItem, ro);

      // should not try to fetch content from hub or portal
      expect(getContentFromHubSpy).not.toHaveBeenCalled();
      expect(getContentFromPortalSpy).not.toHaveBeenCalled();
      expect(enrichContentSpy).toHaveBeenCalled();

      expect(content.hubId).toBeFalsy("don't set hubId in portal");
    });
    it("works with item online", async () => {
      const model = {
        item: {
          // needed for hubId
          access: "public",
          id: "3ef",
        },
        data: { from: "arg" },
      } as unknown as IModel;

      // not portal so that hubId will be set
      const ro = {} as hubModule.IGetContentOptions;

      const content = await getContent(model, ro);

      expect(content.data.from).toBe(
        "arg",
        "used data from the IModel argument"
      );

      // should not try to fetch content from hub or portal
      expect(getContentFromHubSpy).not.toHaveBeenCalled();
      expect(getContentFromPortalSpy).not.toHaveBeenCalled();
      expect(enrichContentSpy).toHaveBeenCalled();

      expect(content.hubId).toBe(model.item.id, "should have set hubId");
    });
  });
  describe("from hub", () => {
    beforeEach(() => {
      requestOpts.isPortal = false;
      requestOpts.portalSelf.isPortal = false;
    });
    describe("with an id", () => {
      const id = "7a153563b0c74f7eb2b3eae8a66f2fbb";
      it("should call getContentFromHub", (done) => {
        const contentFromHub = {
          id,
          // emulating a hub created web map w/o orgId
          // will force additional fetch for owner's orgId
          hubType: "map",
          type: "Web Map",
          typeKeywords: ["ArcGIS Hub"],
        };
        const getContentFromHubSpy = spyOn(
          hubModule,
          "getContentFromHub"
        ).and.returnValue(Promise.resolve(contentFromHub));
        getContent(id, requestOpts).then((content) => {
          expect(getContentFromHubSpy.calls.count()).toBe(1);
          expect(getContentFromHubSpy.calls.argsFor(0)).toEqual([
            id,
            requestOpts,
          ]);
          done();
        });
      });
      it("handles private items", (done) => {
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
            requestOpts,
          ]);
          expect(getContentFromPortalSpy.calls.count()).toBe(1);
          expect(getContentFromPortalSpy.calls.argsFor(0)).toEqual([
            id,
            requestOpts,
          ]);
          done();
        });
      });
    });
    describe("with a slug", () => {
      const slug = "foo";
      it("rejects when not in the index", (done) => {
        const err = new Error("test");
        const getContentFromHubSpy = spyOn(
          hubModule,
          "getContentFromHub"
        ).and.returnValue(Promise.reject(err));
        getContent(slug, requestOpts).catch((e) => {
          expect(getContentFromHubSpy.calls.count()).toBe(1);
          expect(getContentFromHubSpy.calls.argsFor(0)).toEqual([
            slug,
            requestOpts,
          ]);
          expect(e).toEqual(err);
          done();
        });
      });
    });
  });
  describe("from portal", () => {
    it("should call getContentFromPortal", (done) => {
      const id = "foo";
      const contentFromPortal = {
        id,
      };
      const getContentFromPortalSpy = spyOn(
        portalModule,
        "getContentFromPortal"
      ).and.returnValue(Promise.resolve(contentFromPortal));
      getContent(id, requestOpts).then((content) => {
        expect(getContentFromPortalSpy.calls.count()).toBe(1);
        expect(getContentFromPortalSpy.calls.argsFor(0)).toEqual([
          "foo",
          requestOpts,
        ]);
        done();
      });
    });
  });
});
