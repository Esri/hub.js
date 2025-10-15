import * as computePropsModule from "../../../src/users/_internal/computeProps";
import { createMockContext } from "../../mocks/mock-auth";
import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { mergeObjects } from "../../../src/objects/merge-objects";
import { IHubUser } from "../../../src/core/types/IHubUser";
import * as requestModule from "@esri/arcgis-rest-request";

const initContextManager = (opts = {}) => {
  const defaults = {
    // authentication: MOCK_AUTH,
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

  describe("computeProps: ", () => {
    it("computes props correctly", async () => {
      spyOn(computePropsModule, "getPortalSignInSettings").and.callFake(() => {
        return Promise.resolve({
          termsAndConditions: "terms",
          signupText: "signup",
        });
      });

      const getPortalSelfSpy = spyOn(PortalModule, "getSelf").and.callFake(
        () => {
          return Promise.resolve({
            portalProperties: {
              hub: {
                settings: {
                  informationalBanner: false,
                },
              },
            },
          });
        }
      );

      spyOn(requestModule, "request").and.callFake(() => {
        return Promise.resolve({
          termsAndConditions: "terms",
          signupText: "signup",
        });
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
      const requestSpy = spyOn(requestModule, "request").and.callFake(() => {
        return Promise.resolve({
          termsAndConditions: "terms",
          signupText: "signup",
        });
      });

      await computePropsModule.getPortalSignInSettings(authdCtxMgr.context);
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(requestSpy.calls.argsFor(0)[0]).toEqual(
        "https://www.custom-base-url.com/sharing/rest/portals/self/signinSettings"
      );
      expect(requestSpy.calls.argsFor(0)[1]).toEqual({
        ...authdCtxMgr.context.requestOptions,
        httpMethod: "GET",
      });
    });
  });
});
