import { IArcGISContext } from "../../../src/ArcGISContext";
import { updateUserCommunityOrgSettings } from "../../../src/utils/internal/updateCommunityOrgSettings";
import * as requestModule from "@esri/arcgis-rest-request";

describe("updateUserCommunityOrgSettings", () => {
  it("throws an error if there is no current user on the context object", async () => {
    const settings = {};
    const context: IArcGISContext = {} as IArcGISContext;
    try {
      await updateUserCommunityOrgSettings(settings, context);
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
      await updateUserCommunityOrgSettings(settings, context);
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
      await updateUserCommunityOrgSettings(settings, context);
    } catch (error) {
      expect(error).toEqual(
        new Error("User is not an org admin in the current community org")
      );
    }
  });

  it("sends a request to the right url with signup text and terms and conditions", () => {
    const settings = {
      enableSignupText: true,
      signupText: "signup text",
      enableTermsAndConditions: true,
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

    updateUserCommunityOrgSettings(settings, context);

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

  it("sends an empty string for signup text and terms and conditions if they are not enabled", () => {
    const settings = {
      enableSignupText: false,
      signupText: "signup text",
      enableTermsAndConditions: false,
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

    updateUserCommunityOrgSettings(settings, context);

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
