vi.mock("@esri/arcgis-rest-request", async (importOriginal) => {
  return { ...(await importOriginal()), request: vi.fn() };
});

import { describe, it, expect, afterEach, vi } from "vitest";
import * as LimitsModule from "../../src/org/fetchOrgLimits";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as RequestModule from "@esri/arcgis-rest-request";
import type { IUserRequestOptions } from "@esri/arcgis-rest-request";

describe("fetchOrgLimits module:", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("fetching any limits", () => {
    it("sends request and returns response", async () => {
      (RequestModule.request as unknown as any).mockResolvedValue({
        type: "Groups",
        name: "MaxNumUserGroups",
        limitValue: 672,
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
      expect(RequestModule.request).toHaveBeenCalledTimes(1);
      const [url] = (RequestModule.request as unknown as any).mock.calls[0];
      expect(url).toBe(
        "https://myorg.maps.arcgis.com/sharing/rest/portals/self/limits?limitsType=Groups&limitName=MaxNumUserGroups&f=json"
      );
    });
  });

  describe("fetch max user groups", () => {
    it("fetches group limit", async () => {
      (RequestModule.request as unknown as any).mockResolvedValue({
        type: "Groups",
        name: "MaxNumUserGroups",
        limitValue: 672,
      });
      const uro: IUserRequestOptions = {
        authentication: MOCK_AUTH,
      };
      const result = await LimitsModule.fetchMaxNumUserGroupsLimit("self", uro);
      expect(result).toBe(672);
      expect(RequestModule.request).toHaveBeenCalledTimes(1);
      const [url] = (RequestModule.request as unknown as any).mock.calls[0];
      expect(url).toBe(
        "https://myorg.maps.arcgis.com/sharing/rest/portals/self/limits?limitsType=Groups&limitName=MaxNumUserGroups&f=json"
      );
    });
    it("returns 512 on failure", async () => {
      (RequestModule.request as unknown as any).mockRejectedValue({
        zomg: "error",
      });
      const uro: IUserRequestOptions = {
        authentication: MOCK_AUTH,
      };
      const result = await LimitsModule.fetchMaxNumUserGroupsLimit("self", uro);
      expect(result).toBe(512);
      expect(RequestModule.request).toHaveBeenCalledTimes(1);
      const [url] = (RequestModule.request as unknown as any).mock.calls[0];
      expect(url).toBe(
        "https://myorg.maps.arcgis.com/sharing/rest/portals/self/limits?limitsType=Groups&limitName=MaxNumUserGroups&f=json"
      );
    });
  });
});
