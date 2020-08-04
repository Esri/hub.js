import * as fetchMock from "fetch-mock";
import { IItem } from "@esri/arcgis-rest-portal";
import { IEnvelope } from "@esri/arcgis-rest-types";
import { IHubRequestOptions } from "@esri/hub-common";
import { comingSoon, getContent } from "../src/index";
import * as itemJson from "./mocks/item.json";
import { mockUserSession } from "./test-helpers/fake-user-session";

describe("get content", () => {
  afterEach(fetchMock.restore);
  it("should fetch content from the arcgis API", done => {
    fetchMock.once("*", itemJson);
    const requestOpts: IHubRequestOptions = {
      portalSelf: {
        user: {},
        id: "123",
        isPortal: true,
        name: "some-portal"
      },
      isPortal: true,
      hubApiUrl: "some-url",
      authentication: mockUserSession
    };
    const item = itemJson as IItem;
    const id = item.id;
    getContent(id, requestOpts).then(content => {
      // verify that we attempted to fetch from the portal API
      const [url] = fetchMock.calls()[0];
      expect(url).toBe(
        "https://vader.maps.arcgis.com/sharing/rest/content/items/7a153563b0c74f7eb2b3eae8a66f2fbb?f=json&token=fake-token"
      );
      // should include all item properties
      Object.keys(item).forEach(key => {
        // we check name below
        if (key === "name") {
          return;
        }
        expect(content[key]).toEqual(item[key]);
      });
      // should include derived properties
      // in this case, it's not a file type, so name should be title
      expect(content.name).toBe(item.title);
      expect(content.hubType).toBe("map");
      expect(content.summary).toBe(item.snippet);
      expect(content.publisher).toEqual({
        name: item.owner,
        username: item.owner
      });
      // this item has no properties
      expect(content.actionLinks).toBeNull();
      expect(content.hubActions).toBeNull();
      expect(content.metrics).toBeNull();
      const geometry: IEnvelope = {
        xmin: -2.732,
        ymin: 53.4452,
        xmax: -2.4139,
        ymax: 53.6093,
        spatialReference: {
          wkid: 4326
        }
      };
      expect(content.boundary).toEqual({ geometry });
      expect(content.license).toEqual({
        name: "Custom License",
        description: item.accessInformation
      });
      const createdDate = new Date(item.created);
      expect(content.createdDate).toEqual(createdDate);
      expect(content.createdDateSource).toEqual("item.created");
      expect(content.publishedDate).toEqual(createdDate);
      expect(content.publishedDateSource).toEqual("item.created");
      expect(content.updatedDate).toEqual(new Date(item.modified));
      expect(content.updatedDateSource).toEqual("item.modified");
      // TODO: stub getItemThumbnailUrl()
      expect(content.thumbnailUrl).toBe(
        "https://undefined/sharing/rest/content/items/7a153563b0c74f7eb2b3eae8a66f2fbb/info/thumbnail/census.JPG"
      );
      done();
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
