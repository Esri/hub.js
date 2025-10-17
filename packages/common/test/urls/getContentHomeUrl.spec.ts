import { vi } from "vitest";
import { getContentHomeUrl } from "../../src/urls/getContentHomeUrl";
import * as getPortalUrlModule from "../../src/urls/get-portal-url";
import type { IPortal } from "@esri/arcgis-rest-portal";
import type { IHubRequestOptions } from "../../src/hub-types";
import type { IRequestOptions } from "@esri/arcgis-rest-request";

describe("getContentHomeUrl", () => {
  const portalUrl = "https://portal.com";
  const portal: IPortal = {
    id: "31c",
    isPortal: false,
    name: "My portal",
  };
  const requestOptions: IRequestOptions = {
    params: { f: "json" },
  };
  const hubRequestOptions: IHubRequestOptions = {
    isPortal: false,
  };
  const inputs = [
    ["an undefined value"],
    ["a string", `${portalUrl}/sharing/rest`],
    ["an IPortal object", portal],
    ["an IRequestOptions object", requestOptions],
    ["an IHubRequestOptions object", hubRequestOptions],
  ];
  let getPortalUrlStub: any;

  beforeEach(() => {
    getPortalUrlStub = vi
      .spyOn(getPortalUrlModule, "getPortalUrl")
      .mockReturnValue(portalUrl);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  inputs.forEach(([label, value]) => {
    it(`returns the AGO content home URL for ${label as string}`, () => {
      const result = getContentHomeUrl(value as any);
      expect(result).toEqual(`${portalUrl}/home/content.html`);
      expect(getPortalUrlStub).toHaveBeenCalledTimes(1);
      expect(getPortalUrlStub).toHaveBeenCalledWith(value);
    });
  });
});
