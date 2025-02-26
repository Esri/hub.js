import * as requestModule from "@esri/arcgis-rest-request";
import { updatePortalOrgSettings } from "../../../src/utils/internal/updatePortalOrgSettings";
import { IArcGISContext } from "../../../src";

describe("updatePortalOrgSettings", () => {
  it("throws an error if there is no current user on the context object", async () => {
    const settings = {};
    const context: IArcGISContext = {} as IArcGISContext;
    try {
      await updatePortalOrgSettings(settings, context);
    } catch (error) {
      expect(error).toEqual(new Error("User is not authenticated"));
    }
  });

  it("throws an error if the user is not an org admin in the current org", async () => {
    const settings = {};
    const context: IArcGISContext = {
      currentUser: {},
      isOrgAdmin: false,
      isCommunityOrg: true,
    } as unknown as IArcGISContext;
    try {
      await updatePortalOrgSettings(settings, context);
    } catch (error) {
      expect(error).toEqual(
        new Error("User is not an org admin in the current org")
      );
    }
  });

  it("sends a request to the right url w/ showInformationalBanner", () => {
    const settings = {
      showInformationalBanner: true,
    };
    const context: IArcGISContext = {
      isOrgAdmin: true,
      currentUser: {},
      portalUrl: "https://www.community-org.hubqa.arcgis.com",
      hubRequestOptions: {
        authentication: {
          token: "token",
        },
      },
      portal: {
        portalProperties: {
          hub: {
            settings: {
              informationalBanner: false,
            },
          },
        },
      },
    } as unknown as IArcGISContext;
    const requestSpy = spyOn(requestModule, "request").and.returnValue(
      Promise.resolve()
    );
    updatePortalOrgSettings(settings, context);
    expect(requestSpy).toHaveBeenCalledWith(
      "https://www.community-org.hubqa.arcgis.com/sharing/rest/portals/self/update?f=json",
      {
        httpMethod: "POST",
        params: {
          portalProperties: JSON.stringify({
            hub: {
              settings: {
                informationalBanner: true,
              },
            },
          }),
          token: "token",
        },
      }
    );
  });
});
