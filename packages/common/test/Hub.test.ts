import { IPortal } from "@esri/arcgis-rest-portal";
import { IUser } from "@esri/arcgis-rest-types";
import {
  ArcGISContextManager,
  Hub,
  IArcGISContextManagerOptions,
} from "../src";
import { MOCK_AUTH } from "./mocks/mock-auth";

/**
 * Pass this into a ContextManager.create call
 * or directly into Hub.create({managerOptions})
 * to avoid issues w/ context manager making xhrs
 * during it's initialization
 */
const managerOptions: IArcGISContextManagerOptions = {
  authentication: MOCK_AUTH,
  currentUser: {
    username: "casey",
  } as unknown as IUser,
  portal: {
    name: "DC R&D Center",
    urlKey: "dcdev",
    customBaseUrl: "maps.arcgis.com",
  } as unknown as IPortal,
  portalUrl: "https://www.arcgis.com",
};

describe("Hub:", () => {
  describe("static factory and context:", () => {
    it("uses passed in context manager", async () => {
      const contextManager = await ArcGISContextManager.create(managerOptions);
      const chk = await Hub.create({ contextManager });
      expect(chk.context.portalUrl).toBe("https://dcdev.maps.arcgis.com");
    });
    it("uses passed in context manager options", async () => {
      const chk = await Hub.create({ managerOptions });
      expect(chk.context.portalUrl).toBe("https://dcdev.maps.arcgis.com");
    });
    it("uses defaults if passed nothing", async () => {
      const chk = await Hub.create({});
      expect(chk.context.portalUrl).toBe("https://www.arcgis.com");
    });
  });
  describe("returns stores:", () => {
    it("returns projectStore", async () => {
      const chk = await Hub.create({ managerOptions });
      const ps = await chk.getProjectStore();
      // since we don't expose context on the store
      // there's no clean way to verify that the contextMgr
      // was passed into the store. So we're just verifying
      // that what we got back has a create function
      expect(ps.create).toBeDefined();
    });
  });
});
