import * as fetchMock from "fetch-mock";
import * as arcgisRestPortal from "@esri/arcgis-rest-portal";
import { IHubRequestOptions, IModel } from "@esri/hub-common";
import { comingSoon, getContent } from "../src/index";
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
      getContentFromHubSpy = spyOn(
        hubModule,
        "getContentFromHub"
      ).and.returnValue(Promise.resolve({}));
      getContentFromPortalSpy = spyOn(
        portalModule,
        "getContentFromPortal"
      ).and.callFake((item: any) => {
        const { id } = item;
        const content = {
          id,
          // important to flag as a type for which data is fetched
          hubType: "solution"
        };
        return Promise.resolve(content);
      });

      getDataSpy = spyOn(arcgisRestPortal, "getItemData").and.returnValue(
        Promise.resolve({ from: "api" })
      );
    });

    it("works with just an item", async () => {
      const modelWithItem = {
        item: {
          id: "3ef"
        }
      } as IModel;

      const ro = {} as IHubRequestOptions;

      const content = await getContent(modelWithItem, ro);

      expect(content.data.from).toBe("api", "fetched data from API");

      // should go straight to getContentFromPortal()
      expect(getContentFromHubSpy).not.toHaveBeenCalled();
      expect(getContentFromPortalSpy).toHaveBeenCalledWith(
        modelWithItem.item,
        ro
      );

      // should still load data
      expect(getDataSpy).toHaveBeenCalledWith(modelWithItem.item.id, ro);
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

      // should go straight to getContentFromPortal()
      expect(getContentFromHubSpy).not.toHaveBeenCalled();
      expect(getContentFromPortalSpy).toHaveBeenCalledWith(model.item, ro);

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
        const getItemDataSpy = spyOn(arcgisRestPortal, "getItemData");
        const orgId = "ownerOrgId";
        const getUserSpy = spyOn(arcgisRestPortal, "getUser").and.returnValue(
          Promise.resolve({ orgId })
        );
        getContent(id, requestOpts).then(content => {
          expect(getContentFromHubSpy.calls.count()).toBe(1);
          expect(getContentFromHubSpy.calls.argsFor(0)).toEqual([
            id,
            requestOpts
          ]);
          // expect it not to have fetched item data
          expect(getItemDataSpy.calls.count()).toBe(0);
          // expect it to have fetched and set the orgId
          expect(getUserSpy.calls.count()).toBe(1);
          expect(content.orgId).toBe(orgId);
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
        id,
        // emulating template content forces additional fetch for item data
        hubType: "template"
      };
      const itemData = { foo: "bar" };
      const getItemDataSpy = spyOn(
        arcgisRestPortal,
        "getItemData"
      ).and.returnValue(Promise.resolve(itemData));
      const getUserSpy = spyOn(arcgisRestPortal, "getUser");
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
        // expect it to have fetched and set the item data
        expect(getItemDataSpy.calls.count()).toBe(1);
        expect(content.data).toBe(itemData);
        // expect it to not have fetched the orgId
        expect(getUserSpy.calls.count()).toBe(0);
        done();
      });
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
