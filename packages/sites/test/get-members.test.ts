import { getMembers } from "../src/get-members";
import { UserSession } from "@esri/arcgis-rest-auth";
import { IUser } from "@esri/arcgis-rest-types";
import * as hubCommon from "@esri/hub-common";
import * as restPortal from "@esri/arcgis-rest-portal";
import * as restRequest from "@esri/arcgis-rest-request";

describe("getMembers", function() {
  let loggerSpy: jasmine.Spy;
  let getPortalUrlSpy: jasmine.Spy;
  let requestSpy: jasmine.Spy;
  let getUserSpy: jasmine.Spy;
  let members: IUser[];
  let usernames: string[];
  let requestOptions: hubCommon.IHubRequestOptions;

  const TOMORROW = (function() {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    return now;
  })();

  const MOCK_USER_SESSION = new UserSession({
    username: "mockUsername",
    password: "mockPassword",
    token: "mock-token",
    tokenExpires: TOMORROW
  });

  const MOCK_MEMBERS = [
    { username: "mockUsername1" } as IUser,
    { username: "mockUsername2" } as IUser
  ];

  beforeEach(() => {
    loggerSpy = spyOn(console, "error").and.stub();

    members = [];
    usernames = ["username1", "username2"];
    requestOptions = {
      authentication: MOCK_USER_SESSION,
      hubApiUrl: "mock/hubApi/url",
      isPortal: false
    };
  });

  afterEach(() => {
    loggerSpy.calls.reset();
  });

  describe("user is authenticated", function() {
    beforeEach(() => {
      getPortalUrlSpy = spyOn(hubCommon, "getPortalUrl").and.returnValue(
        "mock/portal/url"
      );
    });
    afterEach(() => {
      getPortalUrlSpy.calls.reset();
    });

    describe("network request succeeds", function() {
      beforeEach(async () => {
        requestSpy = spyOn(restRequest, "request").and.returnValue(
          Promise.resolve({ results: MOCK_MEMBERS })
        );
        members = await getMembers(usernames, requestOptions);
      });
      afterEach(() => {
        requestSpy.calls.reset();
      });

      it("calls the getPortalUrl function", function() {
        expect(getPortalUrlSpy).toHaveBeenCalledTimes(1);
        expect(getPortalUrlSpy).toHaveBeenCalledWith(requestOptions);
      });
      it("makes a request to the AGO users search endpoint with the correct parameters", function() {
        const expectedUrlPath = "mock/portal/url/sharing/rest/community/users";
        const expectedOptions = {
          params: {
            q: `${usernames
              .map(username => `username:${username}`)
              .join(" OR ")}`,
            num: 2
          },
          ...requestOptions
        };
        expect(requestSpy).toHaveBeenCalledWith(
          expectedUrlPath,
          expectedOptions
        );
      });
      it("returns the correct result", function() {
        expect(members).toEqual(MOCK_MEMBERS);
      });
    });

    it("handles when more than 100 usernames are supplied", async function() {
      requestSpy = spyOn(restRequest, "request").and.returnValue(
        Promise.resolve({ results: MOCK_MEMBERS })
      );
      for (let i = 0; i < 100; i++) {
        usernames.push(`username${i + 2}`);
      }

      members = await getMembers(usernames, requestOptions);

      expect(requestSpy).toHaveBeenCalledTimes(2);
      expect(members.length).toEqual(2 * MOCK_MEMBERS.length);
    });
    it("handles errors appropriately", async function() {
      hubCommon.Logger.setLogLevel(hubCommon.Level.all);
      requestSpy = spyOn(restRequest, "request").and.returnValue(
        Promise.reject(Error("network request failed"))
      );

      members = await getMembers(usernames, requestOptions);

      expect(loggerSpy).toHaveBeenCalledTimes(1);
      expect(members.length).toEqual(0);
    });
  });

  describe("user is unauthenticated", function() {
    const SCENARIOS = [
      {
        response: { username: "mockUsername1" } as IUser,
        expectedLength: 0,
        description:
          "member does not have public profile - should not be returned to unauthenticated user"
      },
      {
        response: {
          username: "mockUsername1",
          firstName: "mockFirstName"
        } as IUser,
        expectedLength: 1,
        description:
          "member has a first name - assume public profile and return"
      },
      {
        response: {
          username: "mockUsername1",
          lastName: "mockLastName"
        } as IUser,
        expectedLength: 1,
        description: "member has a last name - assume public profile and return"
      },
      {
        response: {
          username: "mockUsername1",
          fullName: "mockFullName"
        } as IUser,
        expectedLength: 1,
        description: "member has a full name - assume public profile and return"
      }
    ];

    beforeEach(async () => {
      requestOptions.authentication = null;
    });
    afterEach(() => {
      getUserSpy.calls.reset();
    });

    it("calls the getUser function with the correct arguments for each username", async function() {
      getUserSpy = spyOn(restPortal, "getUser").and.returnValue(
        Promise.resolve(MOCK_MEMBERS)
      );
      members = await getMembers(usernames, requestOptions);

      expect(getUserSpy).toHaveBeenCalledTimes(usernames.length);
      expect(getUserSpy).toHaveBeenCalledWith({
        username: usernames[0],
        ...requestOptions
      });
    });
    SCENARIOS.forEach(async scenario => {
      it(`returns the correct result: ${
        scenario.description
      }`, async function() {
        usernames = ["mockUsername1"];
        getUserSpy = spyOn(restPortal, "getUser").and.returnValue(
          Promise.resolve(scenario.response)
        );
        members = await getMembers(usernames, requestOptions);

        expect(members.length).toEqual(scenario.expectedLength);
        getUserSpy.and.stub();
      });
    });
    it("handles errors appropriately", async function() {
      hubCommon.Logger.setLogLevel(hubCommon.Level.all);
      getUserSpy = spyOn(restPortal, "getUser").and.returnValue(
        Promise.reject(Error("network request failed"))
      );
      members = await getMembers(usernames, requestOptions);

      expect(loggerSpy).toHaveBeenCalledTimes(2);
      expect(members.length).toEqual(0);
    });
  });
});
