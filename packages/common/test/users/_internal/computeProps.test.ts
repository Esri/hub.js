import * as computePropsModule from "../../../src/users/_internal/computeProps";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { mergeObjects } from "../../../src/objects/merge-objects";
import { IHubUser } from "../../../src/core/types";
import * as requestModule from "@esri/arcgis-rest-request";

const initContextManager = async (opts = {}) => {
  const defaults = {
    authentication: MOCK_AUTH,
    currentUser: {
      username: "casey",
      privileges: ["portal:user:shareToGroup"],
    } as unknown as PortalModule.IUser,
    portal: {
      name: "DC R&D Center",
      id: "BRXFAKE",
      portalHostname: "portal-hostname.com",
      urlKey: "www",
      customBaseUrl: "custom-base-url.com",
    } as unknown as PortalModule.IPortal,
    portalUrl: "https://myserver.com",
  };
  return await ArcGISContextManager.create(
    mergeObjects(opts, defaults, ["currentUser"])
  );
};

describe("HubUser computeProps:", () => {
  let authdCtxMgr: ArcGISContextManager;

  beforeEach(async () => {
    authdCtxMgr = await initContextManager();
  });

  describe("computeProps: ", () => {
    it("computes props correctly", async () => {
      const getPortalSignInSettingsSpy = spyOn(
        computePropsModule,
        "getPortalSignInSettings"
      ).and.callFake(() => {
        return Promise.resolve({
          termsAndConditions: "terms",
          signupText: "signup",
        });
      });

      const requestSpy = spyOn(requestModule, "request").and.callFake(() => {
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

      computePropsModule.getPortalSignInSettings(authdCtxMgr.context);
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

  describe("getSelf:", () => {
    it("fetches portal self successfully", async () => {
      const getSelfSpy = spyOn(PortalModule, "getSelf").and.callFake(() => {
        return Promise.resolve({
          portalProperties: {
            hub: {
              settings: {
                informationalBanner: true,
              },
            },
          },
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

      expect(getSelfSpy).toHaveBeenCalledTimes(1);
      expect(getSelfSpy).toHaveBeenCalledWith(
        authdCtxMgr.context.requestOptions
      );
      expect(chk.hubOrgSettings?.showInformationalBanner).toBeTruthy();
    });
  });
});
