import * as portalModule from "@esri/arcgis-rest-portal";
import { fetchInitiativeTemplate, IHubInitiativeTemplate } from "../../src";
import {
  INITIATIVE_TEMPLATE_ITEM,
  INITIATIVE_TEMPLATE_DATA,
  GUID,
} from "./fixtures";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import * as slugUtils from "../../src/items/slugs";

describe("initiative template fetch module:", async () => {
  describe("fetchInitiativeTemplate:", () => {
    it("gets by id, if passed a guid", async () => {
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(INITIATIVE_TEMPLATE_ITEM)
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(INITIATIVE_TEMPLATE_DATA)
      );

      const chk = await fetchInitiativeTemplate(GUID, {
        authentication: MOCK_AUTH,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe(INITIATIVE_TEMPLATE_ITEM.owner);

      expect(getItemSpy.calls.count()).toBe(1);
      expect(getItemSpy.calls.argsFor(0)[0]).toBe(GUID);
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.argsFor(0)[0]).toBe(GUID);
    });

    it("gets without auth", async () => {
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(INITIATIVE_TEMPLATE_ITEM)
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(INITIATIVE_TEMPLATE_DATA)
      );
      const ro: IRequestOptions = {
        portal: "https://gis.myserver.com/portal/sharing/rest",
      };
      const chk = await fetchInitiativeTemplate(GUID, ro);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe(INITIATIVE_TEMPLATE_ITEM.owner);
      expect(chk.thumbnailUrl).toBe(
        "https://gis.myserver.com/portal/sharing/rest/content/items/9b77674e43cf4bbd9ecad5189b3f1fdc/info/thumbnail/mock-thumbnail.png"
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
      ).and.returnValue(Promise.resolve(INITIATIVE_TEMPLATE_ITEM));
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(INITIATIVE_TEMPLATE_DATA)
      );

      const chk = await fetchInitiativeTemplate("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      expect(getItemBySlugSpy.calls.count()).toBe(1);
      expect(getItemBySlugSpy.calls.argsFor(0)[0]).toBe("dcdev-34th-street");
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.argsFor(0)[0]).toBe(GUID);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe(INITIATIVE_TEMPLATE_ITEM.owner);
    });

    it("returns null if no id found", async () => {
      const getItemBySlugSpy = spyOn(
        slugUtils,
        "getItemBySlug"
      ).and.returnValue(Promise.resolve(null));

      const chk = await fetchInitiativeTemplate("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      expect(getItemBySlugSpy.calls.count()).toBe(1);
      expect(getItemBySlugSpy.calls.argsFor(0)[0]).toBe("dcdev-34th-street");
      // This next stuff is O_o but req'd by typescript
      expect(chk).toEqual(null as unknown as IHubInitiativeTemplate);
    });
  });
});
