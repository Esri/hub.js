import * as LimitsModule from "../../src/org/fetchOrgLimits";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as RequestModule from "@esri/arcgis-rest-request";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

describe("fetchOrgLimits module:", () => {
  describe("fetching any limits", () => {
    it("sends request and returns response", async () => {
      const reqSpy = spyOn(RequestModule, "request").and.callFake(() => {
        return Promise.resolve({
          type: "Groups",
          name: "MaxNumUserGroups",
          limitValue: 672,
        });
      });
      const uro: IUserRequestOptions = {
        authentication: MOCK_AUTH,
      };
      const result = await LimitsModule.fetchOrgLimits(
        "self",
        "Groups",
        "MaxNumUserGroups",
        uro
      );
      expect(result.type).toBe("Groups");
      expect(reqSpy.calls.count()).toBe(1);
      const [url, opts] = reqSpy.calls.argsFor(0);
      expect(url).toBe(
        "https://myorg.maps.arcgis.com/sharing/rest/portals/self/limits?limitsType=Groups&limitName=MaxNumUserGroups&f=json"
      );
    });
  });

  describe("fetch max user groups", () => {
    it("fetches group limit", async () => {
      const reqSpy = spyOn(RequestModule, "request").and.callFake(() => {
        return Promise.resolve({
          type: "Groups",
          name: "MaxNumUserGroups",
          limitValue: 672,
        });
      });
      const uro: IUserRequestOptions = {
        authentication: MOCK_AUTH,
      };
      const result = await LimitsModule.fetchMaxNumUserGroupsLimit("self", uro);
      expect(result).toBe(672);
      expect(reqSpy.calls.count()).toBe(1);
      const [url, opts] = reqSpy.calls.argsFor(0);
      expect(url).toBe(
        "https://myorg.maps.arcgis.com/sharing/rest/portals/self/limits?limitsType=Groups&limitName=MaxNumUserGroups&f=json"
      );
    });
    it("returns 512 on failure", async () => {
      const reqSpy = spyOn(RequestModule, "request").and.callFake(() => {
        return Promise.reject({
          zomg: "error",
        });
      });
      const uro: IUserRequestOptions = {
        authentication: MOCK_AUTH,
      };
      const result = await LimitsModule.fetchMaxNumUserGroupsLimit("self", uro);
      expect(result).toBe(512);
      expect(reqSpy.calls.count()).toBe(1);
      const [url, opts] = reqSpy.calls.argsFor(0);
      expect(url).toBe(
        "https://myorg.maps.arcgis.com/sharing/rest/portals/self/limits?limitsType=Groups&limitName=MaxNumUserGroups&f=json"
      );
    });
  });
});
