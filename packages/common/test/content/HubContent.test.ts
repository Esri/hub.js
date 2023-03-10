import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { IHubEditableContent } from "../../src/core/types";
import { HubContent } from "../../src/content/HubContent";
import * as editModule from "../../src/content/edit";

describe("HubContent class", () => {
  let authdCtxMgr: ArcGISContextManager;
  // let unauthdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    // unauthdCtxMgr = await ArcGISContextManager.create();
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
      } as unknown as PortalModule.IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as PortalModule.IPortal,
      portalUrl: "https://myserver.com",
    });
  });
  describe("ctor:", () => {
    it("save calls createContent if object does not have an id", async () => {
      const createSpy = spyOn(editModule, "createContent").and.callFake(
        (p: IHubEditableContent) => {
          return Promise.resolve(p);
        }
      );
      const chk = HubContent.fromJson(
        { name: "Test Content" },
        authdCtxMgr.context
      );
      await chk.save();
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().name).toEqual("Test Content");
    });
    it("save calls updateContent if object does not have an id", async () => {
      const updateSpy = spyOn(editModule, "updateContent").and.callFake(
        (p: IHubEditableContent) => {
          return Promise.resolve(p);
        }
      );
      const chk = HubContent.fromJson(
        {
          id: "bc3",
          name: "Test Content",
        },
        authdCtxMgr.context
      );
      await chk.save();
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().name).toEqual("Test Content");
    });
  });
  it("update applies partial changes to internal state", () => {
    const chk = HubContent.fromJson(
      {
        id: "bc3",
        name: "Test Content",
      },
      authdCtxMgr.context
    );
    chk.update({
      name: "Test Content 2",
    });
    expect(chk.toJson().name).toEqual("Test Content 2");

    chk.update({ tags: ["one", "two"] });
    expect(chk.toJson().tags).toEqual(["one", "two"]);
  });
  it("delete", async () => {
    const deleteSpy = spyOn(editModule, "deleteContent").and.callFake(() => {
      return Promise.resolve();
    });
    const chk = HubContent.fromJson(
      {
        id: "bc3",
        name: "Test Content",
      },
      authdCtxMgr.context
    );
    await chk.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);

    // all fns should now throw an error
    expect(() => {
      chk.toJson();
    }).toThrowError("Entity is already destroyed.");

    expect(() => {
      chk.update({ name: "Test Content 2" } as IHubEditableContent);
    }).toThrowError("HubContent is already destroyed.");

    // async calls
    try {
      await chk.delete();
    } catch (e) {
      expect(e.message).toEqual("HubContent is already destroyed.");
    }

    try {
      await chk.save();
    } catch (e) {
      expect(e.message).toEqual("HubContent is already destroyed.");
    }
  });
});
