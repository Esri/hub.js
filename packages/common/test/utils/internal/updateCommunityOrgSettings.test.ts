import { IArcGISContext } from "../../../src";
import { updateCommunityOrgSettings } from "../../../src/utils/internal/updateCommunityOrgSettings";
import * as requestModule from "@esri/arcgis-rest-request";

describe("updateCommunityOrgSettings", () => {
  it("throws an error if there is no current user on the context object", async () => {
    const settings = {};
    const context: IArcGISContext = {} as IArcGISContext;
    try {
      await updateCommunityOrgSettings(settings, context);
    } catch (error) {
      expect(error).toEqual(new Error("User is not authenticated"));
    }
  });

  it("throws an error if the user is not an org admin in the current community org", async () => {
    const settings = {};
    const context: IArcGISContext = {
      currentUser: {},
      isOrgAdmin: false,
      isCommunityOrg: true,
    } as unknown as IArcGISContext;

    try {
      await updateCommunityOrgSettings(settings, context);
    } catch (error) {
      expect(error).toEqual(
        new Error("User is not an org admin in the current community org")
      );
    }
  });

  it("throws an error if the user is not in a community org", async () => {
    const settings = {};
    const context: IArcGISContext = {
      isOrgAdmin: true,
      currentUser: {},
      isCommunityOrg: false,
    } as unknown as IArcGISContext;

    try {
      await updateCommunityOrgSettings(settings, context);
    } catch (error) {
      expect(error).toEqual(
        new Error("User is not an org admin in the current community org")
      );
    }
  });

  it("sends a request to the right url with signup text and terms and conditions", async () => {
    const settings = {
      signupText: "signup text",
      termsAndConditions: "terms and conditions",
    };
    const context: IArcGISContext = {
      isOrgAdmin: true,
      isCommunityOrg: true,
      currentUser: {},
      portalUrl: "https://www.community-org.hubqa.arcgis.com",
      hubRequestOptions: {
        authentication: {
          token: "fake-token",
        },
      },
    } as unknown as IArcGISContext;

    const requestSpy = spyOn(requestModule, "request").and.callFake(() =>
      Promise.resolve({})
    );

    await updateCommunityOrgSettings(settings, context);

    expect(requestSpy).toHaveBeenCalledWith(
      "https://www.community-org.hubqa.arcgis.com/sharing/rest/portals/self/setSigninSettings?f=json",
      {
        httpMethod: "POST",
        params: {
          termsAndConditions: "terms and conditions",
          signupText: "signup text",
          clearEmptyFields: false,
          token: "fake-token",
        },
      }
    );
  });

  it("sends an empty string for signup text and terms and conditions if values are empty", async () => {
    const settings = {
      signupText: "",
      termsAndConditions: "",
    };
    const context: IArcGISContext = {
      isOrgAdmin: true,
      isCommunityOrg: true,
      currentUser: {},
      portalUrl: "https://www.community-org.hubqa.arcgis.com",
      hubRequestOptions: {
        authentication: {
          token: "fake-token",
        },
      },
    } as unknown as IArcGISContext;

    const requestSpy = spyOn(requestModule, "request").and.callFake(() =>
      Promise.resolve({})
    );

    await updateCommunityOrgSettings(settings, context);

    expect(requestSpy).toHaveBeenCalledWith(
      "https://www.community-org.hubqa.arcgis.com/sharing/rest/portals/self/setSigninSettings?f=json",
      {
        httpMethod: "POST",
        params: {
          termsAndConditions: "",
          signupText: "",
          clearEmptyFields: true,
          token: "fake-token",
        },
      }
    );
  });
});
