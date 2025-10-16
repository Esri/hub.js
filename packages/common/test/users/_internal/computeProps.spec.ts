import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as computePropsModule from "../../../src/users/_internal/computeProps";
import type { ArcGISContext } from "../../../src/ArcGISContext";
import { createMockContext } from "../../mocks/mock-auth";
import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { mergeObjects } from "../../../src/objects/merge-objects";
import { IHubUser } from "../../../src/core/types/IHubUser";
import * as requestModule from "@esri/arcgis-rest-request";

vi.mock("@esri/arcgis-rest-request");
vi.mock("@esri/arcgis-rest-portal");

const initContextManager = (opts = {}): { context: ArcGISContext } => {
  const defaults = {
    currentUser: {
      username: "casey",
      privileges: ["portal:user:shareToGroup"],
    } as unknown as PortalModule.IUser,
    portalSelf: {
      name: "DC R&D Center",
      id: "BRXFAKE",
      portalHostname: "portal-hostname.com",
      urlKey: "www",
      customBaseUrl: "custom-base-url.com",
    } as unknown as PortalModule.IPortal,
    portalUrl: "https://myserver.com",
  };
  return {
    context: createMockContext(mergeObjects(opts, defaults, ["currentUser"])),
  };
};

describe("HubUser computeProps:", () => {
  let authdCtxMgr: Partial<ArcGISContextManager>;

  beforeEach(async () => {
    authdCtxMgr = initContextManager();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("computeProps: ", () => {
    it("computes props correctly", async () => {
      vi.spyOn(
        computePropsModule as any,
        "getPortalSignInSettings"
      ).mockResolvedValue({
        termsAndConditions: "terms",
        signupText: "signup",
      });

      const getPortalSelfSpy = vi
        .spyOn(PortalModule as any, "getSelf")
        .mockResolvedValue({
          portalProperties: {
            hub: {
              settings: {
                informationalBanner: false,
              },
            },
          },
        });

      vi.spyOn(requestModule as any, "request").mockResolvedValue({
        termsAndConditions: "terms",
        signupText: "signup",
      });

      const user = {
        hubOrgSettings: {
          showInformationalBanner: true,
          termsAndConditions: "termsOld",
          signupText: "signupOld",
        },
      } as unknown as IHubUser;

      const chk = await computePropsModule.computeProps(
        {},
        user,
        authdCtxMgr.context
      );

      expect(getPortalSelfSpy).toHaveBeenCalledTimes(1);
      expect(chk.hubOrgSettings?.termsAndConditions).toEqual("terms");
      expect(chk.hubOrgSettings?.signupText).toEqual("signup");
      expect(chk.hubOrgSettings?.showInformationalBanner).toBeFalsy();
    });
  });

  describe("getPortalSignInSettings:", () => {
    it("fetches portal signin settings", async () => {
      // ensure getPortalUrl returns the expected sharing/rest base
      vi.spyOn(PortalModule as any, "getPortalUrl").mockReturnValue(
        "https://www.custom-base-url.com/sharing/rest"
      );
      const requestSpy = vi
        .spyOn(requestModule as any, "request")
        .mockResolvedValue({
          termsAndConditions: "terms",
          signupText: "signup",
        });

      await computePropsModule.getPortalSignInSettings(authdCtxMgr.context);
      expect(requestSpy).toHaveBeenCalledTimes(1);
      const [url, opts] = (requestSpy as any).mock.calls[0];
      expect(url).toEqual(
        "https://www.custom-base-url.com/sharing/rest/portals/self/signinSettings"
      );
      expect(opts).toEqual({
        ...authdCtxMgr.context.requestOptions,
        httpMethod: "GET",
      });
    });
  });
});
