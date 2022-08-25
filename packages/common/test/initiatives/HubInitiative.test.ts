import * as PortalModule from "@esri/arcgis-rest-portal";
import { Catalog, IHubInitiative, PermissionManager } from "../../src";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubInitiative } from "../../src/initiatives/HubInitiative";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as HubInitiativesModule from "../../src/initiatives/HubInitiatives";
import * as SharedWithModule from "../../src/core/_internal/sharedWith";

describe("HubInitiative Class:", () => {
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
      const createSpy = spyOn(HubInitiativesModule, "createInitiative");
      const chk = HubInitiative.fromJson(
        { name: "Test Initiative" },
        authdCtxMgr.context
      );

      expect(createSpy).not.toHaveBeenCalled();
      expect(chk.toJson().name).toEqual("Test Initiative");
      // adds empty permissions and catalog
      const json = chk.toJson();
      expect(json.permissions).toEqual([]);
      expect(json.catalog).toEqual({ schemaVersion: 0 });
    });
    it("loads based on identifier", async () => {
      const fetchSpy = spyOn(
        HubInitiativesModule,
        "fetchInitiative"
      ).and.callFake((id: string) => {
        return Promise.resolve({
          id,
          name: "Test Initiative",
        });
      });

      const chk = await HubInitiative.fetch("3ef", authdCtxMgr.context);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().id).toBe("3ef");
      expect(chk.toJson().name).toBe("Test Initiative");
    });

    it("handle load missing Initiatives", async () => {
      const fetchSpy = spyOn(
        HubInitiativesModule,
        "fetchInitiative"
      ).and.callFake((id: string) => {
        const err = new Error(
          "CONT_0001: Item does not exist or is inaccessible."
        );
        return Promise.reject(err);
      });
      try {
        await HubInitiative.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(ex.message).toBe("Initiative not found.");
      }
    });

    it("handle load errors", async () => {
      const fetchSpy = spyOn(
        HubInitiativesModule,
        "fetchInitiative"
      ).and.callFake((id: string) => {
        const err = new Error("ZOMG!");
        return Promise.reject(err);
      });
      try {
        await HubInitiative.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(ex.message).toBe("ZOMG!");
      }
    });
  });

  it("save call createInitiative if object does not have an id", async () => {
    const createSpy = spyOn(
      HubInitiativesModule,
      "createInitiative"
    ).and.callFake((p: IHubInitiative) => {
      return Promise.resolve(p);
    });
    const chk = await HubInitiative.fromJson(
      { name: "Test Initiative" },
      authdCtxMgr.context
    );
    await chk.save();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Initiative");
  });
  it("create saves the instance if passed true", async () => {
    const createSpy = spyOn(
      HubInitiativesModule,
      "createInitiative"
    ).and.callFake((p: IHubInitiative) => {
      p.id = "3ef";
      return Promise.resolve(p);
    });
    const chk = await HubInitiative.create(
      { name: "Test Initiative" },
      authdCtxMgr.context,
      true
    );

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Initiative");
  });
  it("create does not save by default", async () => {
    const createSpy = spyOn(HubInitiativesModule, "createInitiative");
    const chk = await HubInitiative.create(
      { name: "Test Initiative" },
      authdCtxMgr.context
    );

    expect(createSpy).not.toHaveBeenCalled();
    expect(chk.toJson().name).toEqual("Test Initiative");
  });

  it("update applies partial chagnes to internal state", () => {
    const chk = HubInitiative.fromJson(
      { name: "Test Initiative", catalog: { schemaVersion: 0 } },
      authdCtxMgr.context
    );
    chk.update({
      name: "Test Initiative 2",
      permissions: [
        { permission: "addEvent", target: "group", targetId: "3ef" },
      ],
      catalog: { schemaVersion: 2 },
    });
    expect(chk.toJson().name).toEqual("Test Initiative 2");
    expect(chk.toJson().catalog).toEqual({ schemaVersion: 2 });

    chk.update({ tags: ["one", "two"] });
    expect(chk.toJson().tags).toEqual(["one", "two"]);
  });

  it("save updates if object has id", async () => {
    const updateSpy = spyOn(
      HubInitiativesModule,
      "updateInitiative"
    ).and.callFake((p: IHubInitiative) => {
      return Promise.resolve(p);
    });
    const chk = HubInitiative.fromJson(
      {
        id: "bc3",
        name: "Test Initiative",
        catalog: { schemaVersion: 0 },
      },
      authdCtxMgr.context
    );
    await chk.save();
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it("delete", async () => {
    const deleteSpy = spyOn(
      HubInitiativesModule,
      "deleteInitiative"
    ).and.callFake(() => {
      return Promise.resolve();
    });
    const chk = HubInitiative.fromJson(
      { name: "Test Initiative" },
      authdCtxMgr.context
    );
    await chk.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    // all fns should now throw an error
    expect(() => {
      chk.toJson();
    }).toThrowError("HubInitiative is already destroyed.");

    expect(() => {
      chk.update({ name: "Test Initiative 2" } as IHubInitiative);
    }).toThrowError("HubInitiative is already destroyed.");

    // async calls
    try {
      await chk.delete();
    } catch (e) {
      expect(e.message).toEqual("HubInitiative is already destroyed.");
    }

    try {
      await chk.save();
    } catch (e) {
      expect(e.message).toEqual("HubInitiative is already destroyed.");
    }
  });

  it("internal instance accessors", () => {
    const chk = HubInitiative.fromJson(
      { name: "Test Initiative", catalog: { schemaVersion: 0 } },
      authdCtxMgr.context
    );

    expect(chk.catalog instanceof Catalog).toBeTruthy();
    expect(chk.permissions instanceof PermissionManager).toBeTruthy();
  });

  it("setting catalog updates catalog instance", () => {
    const chk = HubInitiative.fromJson(
      { name: "Test Initiative", catalog: { schemaVersion: 0 } },
      authdCtxMgr.context
    );
    chk.update({ catalog: { schemaVersion: 2 } });
    expect(chk.toJson().catalog).toEqual({ schemaVersion: 2 });
    expect(chk.catalog.schemaVersion).toEqual(2);
  });

  describe("sharing behavior:", () => {
    let testInitiative: HubInitiative;
    beforeEach(() => {
      testInitiative = HubInitiative.fromJson(
        {
          id: "00c",
          name: "Test Initiative",
          owner: "deke",
          catalog: { schemaVersion: 0 },
        },
        authdCtxMgr.context
      );
    });
    it("shares to group", async () => {
      const shareSpy = spyOn(PortalModule, "shareItemWithGroup").and.callFake(
        () => {
          return Promise.resolve();
        }
      );
      await testInitiative.shareWithGroup("3ef");
      expect(shareSpy).toHaveBeenCalledTimes(1);
      // verify args
      expect(shareSpy).toHaveBeenCalledWith({
        id: "00c",
        groupId: "3ef",
        owner: "deke",
        authentication: authdCtxMgr.context.session,
      });
    });

    it("unshared from group", async () => {
      const unshareSpy = spyOn(
        PortalModule,
        "unshareItemWithGroup"
      ).and.callFake(() => {
        return Promise.resolve();
      });
      await testInitiative.unshareWithGroup("3ef");
      expect(unshareSpy).toHaveBeenCalledWith({
        id: "00c",
        groupId: "3ef",
        owner: "deke",
        authentication: authdCtxMgr.context.session,
      });
    });

    it("sets access", async () => {
      const setAccessSpy = spyOn(PortalModule, "setItemAccess").and.callFake(
        () => {
          return Promise.resolve();
        }
      );
      await testInitiative.setAccess("public");
      expect(setAccessSpy).toHaveBeenCalledTimes(1);
      // verify args
      expect(setAccessSpy).toHaveBeenCalledWith({
        id: "00c",
        access: "public",
        authentication: authdCtxMgr.context.session,
      });
      // verify update to access property
      expect(testInitiative.toJson().access).toEqual("public");
    });

    it("gets groups entity is shared to", async () => {
      const spy = spyOn(SharedWithModule, "sharedWith").and.callFake(() => {
        return Promise.resolve([{ id: "3ef", name: "Test Group" }]);
      });
      const groups = await testInitiative.sharedWith();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        "00c",
        authdCtxMgr.context.requestOptions
      );
      expect(groups.length).toEqual(1);
    });
  });
});
