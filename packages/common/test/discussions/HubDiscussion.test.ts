import * as PortalModule from "@esri/arcgis-rest-portal";
import { IHubDiscussion } from "../../src";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubDiscussion } from "../../src/discussions/HubDiscussion";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as HubDiscussionsModule from "../../src/discussions/HubDiscussions";

describe("HubDiscussion Class:", () => {
  let authdCtxMgr: ArcGISContextManager;
  let unauthdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    unauthdCtxMgr = await ArcGISContextManager.create();
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
    it("loads from minimal json", () => {
      const createSpy = spyOn(HubDiscussionsModule, "createDiscussion");
      const chk = HubDiscussion.fromJson(
        { name: "Test Discussion" },
        authdCtxMgr.context
      );

      expect(createSpy).not.toHaveBeenCalled();
      expect(chk.toJson().name).toEqual("Test Discussion");
      // adds empty permissions and catalog
      const json = chk.toJson();
      expect(json.permissions).toEqual([]);
    });
    it("loads based on identifier", async () => {
      const fetchSpy = spyOn(
        HubDiscussionsModule,
        "fetchDiscussion"
      ).and.callFake((id: string) => {
        return Promise.resolve({
          id,
          name: "Test Discussion",
        });
      });

      const chk = await HubDiscussion.fetch("3ef", authdCtxMgr.context);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().id).toBe("3ef");
      expect(chk.toJson().name).toBe("Test Discussion");
    });

    it("handle load missing Discussions", async () => {
      const fetchSpy = spyOn(
        HubDiscussionsModule,
        "fetchDiscussion"
      ).and.callFake((id: string) => {
        const err = new Error(
          "CONT_0001: Item does not exist or is inaccessible."
        );
        return Promise.reject(err);
      });
      try {
        await HubDiscussion.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(ex.message).toBe("Discussion not found.");
      }
    });

    it("handle load errors", async () => {
      const fetchSpy = spyOn(
        HubDiscussionsModule,
        "fetchDiscussion"
      ).and.callFake((id: string) => {
        const err = new Error("ZOMG!");
        return Promise.reject(err);
      });
      try {
        await HubDiscussion.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(ex.message).toBe("ZOMG!");
      }
    });
  });

  it("save call createDiscussion if object does not have an id", async () => {
    const createSpy = spyOn(
      HubDiscussionsModule,
      "createDiscussion"
    ).and.callFake((p: IHubDiscussion) => {
      return Promise.resolve(p);
    });
    const chk = await HubDiscussion.fromJson(
      { name: "Test Discussion" },
      authdCtxMgr.context
    );
    await chk.save();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Discussion");
  });
  it("create saves the instance if passed true", async () => {
    const createSpy = spyOn(
      HubDiscussionsModule,
      "createDiscussion"
    ).and.callFake((p: IHubDiscussion) => {
      p.id = "3ef";
      return Promise.resolve(p);
    });
    const chk = await HubDiscussion.create(
      { name: "Test Discussion" },
      authdCtxMgr.context,
      true
    );

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Discussion");
  });
  it("create does not save by default", async () => {
    const createSpy = spyOn(HubDiscussionsModule, "createDiscussion");
    const chk = await HubDiscussion.create(
      { name: "Test Discussion" },
      authdCtxMgr.context
    );

    expect(createSpy).not.toHaveBeenCalled();
    expect(chk.toJson().name).toEqual("Test Discussion");
  });

  it("update applies partial chagnes to internal state", () => {
    const chk = HubDiscussion.fromJson(
      { name: "Test Discussion" },
      authdCtxMgr.context
    );
    chk.update({
      name: "Test Discussion 2",
      permissions: [
        {
          permission: "hub:project:create",
          collaborationType: "group",
          collaborationId: "3ef",
        },
      ],
    });
    expect(chk.toJson().name).toEqual("Test Discussion 2");

    chk.update({ tags: ["one", "two"] });
    expect(chk.toJson().tags).toEqual(["one", "two"]);
  });

  it("save updates if object has id", async () => {
    const updateSpy = spyOn(
      HubDiscussionsModule,
      "updateDiscussion"
    ).and.callFake((p: IHubDiscussion) => {
      return Promise.resolve(p);
    });
    const chk = HubDiscussion.fromJson(
      {
        id: "bc3",
        name: "Test Discussion",
      },
      authdCtxMgr.context
    );
    await chk.save();
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it("delete", async () => {
    const deleteSpy = spyOn(
      HubDiscussionsModule,
      "deleteDiscussion"
    ).and.callFake(() => {
      return Promise.resolve();
    });
    const chk = HubDiscussion.fromJson(
      { name: "Test Discussion" },
      authdCtxMgr.context
    );
    await chk.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    // all fns should now throw an error
    expect(() => {
      chk.toJson();
    }).toThrowError("Entity is already destroyed.");

    expect(() => {
      chk.update({ name: "Test Discussion 2" } as IHubDiscussion);
    }).toThrowError("HubDiscussion is already destroyed.");

    // async calls
    try {
      await chk.delete();
    } catch (e) {
      expect(e.message).toEqual("HubDiscussion is already destroyed.");
    }

    try {
      await chk.save();
    } catch (e) {
      expect(e.message).toEqual("HubDiscussion is already destroyed.");
    }
  });
});
