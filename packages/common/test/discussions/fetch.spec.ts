import { vi, afterEach } from "vitest";

// Mock the arcgis-rest-portal namespace so its exports are configurable in ESM.
vi.mock("@esri/arcgis-rest-portal", async () => {
  const original = await vi.importActual("@esri/arcgis-rest-portal");
  return {
    ...(original as any),
  };
});
import * as portalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as slugUtils from "../../src/items/slugs";
import { IHubRequestOptions } from "../../src/hub-types";
import { fetchDiscussion } from "../../src/discussions/fetch";
import { IHubDiscussion } from "../../src/core/types/IHubDiscussion";
import * as settingUtils from "../../src/discussions/api/settings/settings";
import * as getDefaultEntitySettingsUtils from "../../src/discussions/api/settings/getDefaultEntitySettings";

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

const DEFAULT_SETTINGS =
  getDefaultEntitySettingsUtils.getDefaultEntitySettings("discussion");

describe("discussions fetch:", () => {
  describe("fetchDiscussion:", () => {
    it("gets by id, if passed a guid", async () => {
      afterEach(() => vi.restoreAllMocks());
      const getItemSpy = vi
        .spyOn(portalModule, "getItem")
        .mockResolvedValue(DISCUSSION_ITEM as any);
      const getItemDataSpy = vi
        .spyOn(portalModule, "getItemData")
        .mockResolvedValue(DISCUSSION_DATA as any);
      const fetchSettingsSpy = vi
        .spyOn(settingUtils, "fetchSettingV2")
        .mockResolvedValue({ id: GUID, ...DEFAULT_SETTINGS } as any);

      const chk = await fetchDiscussion(GUID, {
        authentication: MOCK_AUTH,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(chk.entitySettingsId).toBe(GUID);
      expect(chk.discussionSettings).toEqual(
        DEFAULT_SETTINGS.settings?.discussions
      );
      expect(getItemSpy.mock.calls.length).toBe(1);
      expect(getItemSpy.mock.calls[0][0]).toBe(GUID);
      expect(getItemDataSpy.mock.calls.length).toBe(1);
      expect(getItemDataSpy.mock.calls[0][0]).toBe(GUID);
      expect(fetchSettingsSpy.mock.calls.length).toBe(1);
    });

    it("supports not having data", async () => {
      const getItemSpy = vi
        .spyOn(portalModule, "getItem")
        .mockResolvedValue(DISCUSSION_ITEM as any);
      const getItemDataSpy = vi
        .spyOn(portalModule, "getItemData")
        .mockResolvedValue(undefined as any);
      const fetchSettingsSpy = vi
        .spyOn(settingUtils, "fetchSettingV2")
        .mockResolvedValue({ id: GUID, ...DEFAULT_SETTINGS } as any);

      const chk = await fetchDiscussion(GUID, {
        authentication: MOCK_AUTH,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(chk.entitySettingsId).toBe(GUID);
      expect(chk.discussionSettings).toEqual(
        DEFAULT_SETTINGS.settings?.discussions
      );
      expect(getItemSpy.mock.calls.length).toBe(1);
      expect(getItemSpy.mock.calls[0][0]).toBe(GUID);
      expect(getItemDataSpy.mock.calls.length).toBe(1);
      expect(getItemDataSpy.mock.calls[0][0]).toBe(GUID);
      expect(fetchSettingsSpy.mock.calls.length).toBe(1);
    });

    it("gets without auth", async () => {
      const getItemSpy = vi
        .spyOn(portalModule, "getItem")
        .mockResolvedValue(DISCUSSION_ITEM as any);
      const getItemDataSpy = vi
        .spyOn(portalModule, "getItemData")
        .mockResolvedValue(DISCUSSION_DATA as any);
      const fetchSettingsSpy = vi
        .spyOn(settingUtils, "fetchSettingV2")
        .mockResolvedValue({ id: GUID, ...DEFAULT_SETTINGS } as any);
      const ro: IHubRequestOptions = {
        portal: "https://gis.myserver.com/portal/sharing/rest",
      };
      const chk = await fetchDiscussion(GUID, ro);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(chk.thumbnailUrl).toBe(
        "https://gis.myserver.com/portal/sharing/rest/content/items/9b77674e43cf4bbd9ecad5189b3f1fdc/info/vader.png"
      );
      expect(chk.entitySettingsId).toBe(GUID);
      expect(chk.discussionSettings).toEqual(
        DEFAULT_SETTINGS.settings?.discussions
      );
      expect(getItemSpy.mock.calls.length).toBe(1);
      expect(getItemSpy.mock.calls[0][0]).toBe(GUID);
      expect(getItemDataSpy.mock.calls.length).toBe(1);
      expect(getItemDataSpy.mock.calls[0][0]).toBe(GUID);
      expect(fetchSettingsSpy.mock.calls.length).toBe(1);
    });

    it("gets by slug if not passed guid", async () => {
      const getItemBySlugSpy = vi
        .spyOn(slugUtils, "getItemBySlug")
        .mockResolvedValue(DISCUSSION_ITEM as any);
      const getItemDataSpy = vi
        .spyOn(portalModule, "getItemData")
        .mockResolvedValue(DISCUSSION_DATA as any);
      const fetchSettingsSpy = vi
        .spyOn(settingUtils, "fetchSettingV2")
        .mockResolvedValue({ id: GUID, ...DEFAULT_SETTINGS } as any);

      const chk = await fetchDiscussion("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      expect(getItemBySlugSpy.mock.calls.length).toBe(1);
      expect(getItemBySlugSpy.mock.calls[0][0]).toBe("dcdev-34th-street");
      expect(getItemDataSpy.mock.calls.length).toBe(1);
      expect(getItemDataSpy.mock.calls[0][0]).toBe(GUID);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(chk.entitySettingsId).toBe(GUID);
      expect(chk.discussionSettings).toEqual(
        DEFAULT_SETTINGS.settings?.discussions
      );
      expect(fetchSettingsSpy.mock.calls.length).toBe(1);
    });

    it("gets default settings if fetch fails", async () => {
      const getItemSpy = vi
        .spyOn(portalModule, "getItem")
        .mockResolvedValue(DISCUSSION_ITEM as any);
      const getItemDataSpy = vi
        .spyOn(portalModule, "getItemData")
        .mockResolvedValue(DISCUSSION_DATA as any);
      const fetchSettingsSpy = vi
        .spyOn(settingUtils, "fetchSettingV2")
        .mockRejectedValue(new Error("none found"));
      const getDefaultEntitySettingsSpy = vi
        .spyOn(getDefaultEntitySettingsUtils, "getDefaultEntitySettings")
        .mockReturnValue(DEFAULT_SETTINGS as any);

      const chk = await fetchDiscussion(GUID, {
        authentication: MOCK_AUTH,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(chk.entitySettingsId).toBeFalsy();
      expect(chk.discussionSettings).toEqual(
        DEFAULT_SETTINGS.settings?.discussions
      );
      expect(getItemSpy.mock.calls.length).toBe(1);
      expect(getItemSpy.mock.calls[0][0]).toBe(GUID);
      expect(getItemDataSpy.mock.calls.length).toBe(1);
      expect(getItemDataSpy.mock.calls[0][0]).toBe(GUID);
      expect(fetchSettingsSpy.mock.calls.length).toBe(1);
      expect(getDefaultEntitySettingsSpy.mock.calls.length).toBe(1);
    });

    it("returns null if no id found", async () => {
      const getItemBySlugSpy = vi
        .spyOn(slugUtils, "getItemBySlug")
        .mockResolvedValue(null as any);

      const chk = await fetchDiscussion("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      expect(getItemBySlugSpy.mock.calls.length).toBe(1);
      expect(getItemBySlugSpy.mock.calls[0][0]).toBe("dcdev-34th-street");
      // This next stuff is O_o but req'd by typescript
      expect(chk).toEqual(null as unknown as IHubDiscussion);
    });
  });
});
