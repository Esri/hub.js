import * as portalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as slugUtils from "../../src/items/slugs";
import { IHubRequestOptions } from "../../src/types";
import { fetchDiscussion } from "../../src/discussions/fetch";
import { IHubDiscussion } from "../../src/core/types/IHubDiscussion";
import * as settingUtils from "../../src";

// TODO: update
const GUID = "9b77674e43cf4bbd9ecad5189b3f1fdc";
const DISCUSSION_ITEM: portalModule.IItem = {
  id: GUID,
  title: "Fake Discussion",
  description: "fake description",
  snippet: "fake snippet",
  properties: {
    schemaVersion: 1,
  },
  owner: "vader",
  type: "Discussion",
  created: 1643646881000,
  modified: 1643646881000,
  tags: [],
  typeKeywords: [],
  thumbnail: "vader.png",
  numViews: 10,
  size: 0,
} as portalModule.IItem;

const DISCUSSION_DATA = {
  settings: { capabilities: {} },
};

describe("discussions fetch:", () => {
  describe("fetchDiscussion:", () => {
    it("gets by id, if passed a guid", async () => {
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(DISCUSSION_ITEM)
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(DISCUSSION_DATA)
      );
      const fetchSettingsSpy = spyOn(settingUtils, "fetchSetting").and.callFake(
        () => settingUtils.getDefaultEntitySettings("discussion")
      );

      const chk = await fetchDiscussion(GUID, {
        authentication: MOCK_AUTH,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(getItemSpy.calls.count()).toBe(1);
      expect(getItemSpy.calls.argsFor(0)[0]).toBe(GUID);
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.argsFor(0)[0]).toBe(GUID);
    });

    it("supports not having data", async () => {
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(DISCUSSION_ITEM)
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve()
      );
      const fetchSettingsSpy = spyOn(settingUtils, "fetchSetting").and.callFake(
        () => settingUtils.getDefaultEntitySettings("discussion")
      );

      const chk = await fetchDiscussion(GUID, {
        authentication: MOCK_AUTH,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(getItemSpy.calls.count()).toBe(1);
      expect(getItemSpy.calls.argsFor(0)[0]).toBe(GUID);
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.argsFor(0)[0]).toBe(GUID);
    });

    it("gets without auth", async () => {
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(DISCUSSION_ITEM)
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(DISCUSSION_DATA)
      );
      const fetchSettingsSpy = spyOn(settingUtils, "fetchSetting").and.callFake(
        () => settingUtils.getDefaultEntitySettings("discussion")
      );
      const ro: IHubRequestOptions = {
        portal: "https://gis.myserver.com/portal/sharing/rest",
      };
      const chk = await fetchDiscussion(GUID, ro);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(chk.thumbnailUrl).toBe(
        "https://gis.myserver.com/portal/sharing/rest/content/items/9b77674e43cf4bbd9ecad5189b3f1fdc/info/vader.png"
      );
      expect(getItemSpy.calls.count()).toBe(1);
      expect(getItemSpy.calls.argsFor(0)[0]).toBe(GUID);
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.argsFor(0)[0]).toBe(GUID);
    });

    it("gets by slug if not passed guid", async () => {
      const getItemBySlugSpy = spyOn(
        slugUtils,
        "getItemBySlug"
      ).and.returnValue(Promise.resolve(DISCUSSION_ITEM));
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(DISCUSSION_DATA)
      );
      const fetchSettingsSpy = spyOn(settingUtils, "fetchSetting").and.callFake(
        () => settingUtils.getDefaultEntitySettings("discussion")
      );

      const chk = await fetchDiscussion("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      expect(getItemBySlugSpy.calls.count()).toBe(1);
      expect(getItemBySlugSpy.calls.argsFor(0)[0]).toBe("dcdev-34th-street");
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.argsFor(0)[0]).toBe(GUID);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
    });

    it("returns null if no id found", async () => {
      const getItemBySlugSpy = spyOn(
        slugUtils,
        "getItemBySlug"
      ).and.returnValue(Promise.resolve(null));

      const chk = await fetchDiscussion("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      expect(getItemBySlugSpy.calls.count()).toBe(1);
      expect(getItemBySlugSpy.calls.argsFor(0)[0]).toBe("dcdev-34th-street");
      // This next stuff is O_o but req'd by typescript
      expect(chk).toEqual(null as unknown as IHubDiscussion);
    });
  });
});
