import { getContentHomeUrl } from "../../src/urls/getContentHomeUrl";
import * as getPortalUrlModule from "../../src/urls/get-portal-url";
import { IPortal } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../../src/hub-types";
import { IRequestOptions } from "@esri/arcgis-rest-request";

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
  let getPortalUrlStub: jasmine.Spy;

  beforeEach(() => {
    getPortalUrlStub = spyOn(
      getPortalUrlModule,
      "getPortalUrl"
    ).and.returnValue(portalUrl);
  });

  afterEach(() => {
    getPortalUrlStub.calls.reset();
  });

  inputs.forEach(([label, value]) => {
    it(`returns the AGO content home URL for ${label}`, () => {
      const result = getContentHomeUrl(value);
      expect(result).toEqual(`${portalUrl}/home/content.html`);
      expect(getPortalUrlStub).toHaveBeenCalledTimes(1);
      expect(getPortalUrlStub).toHaveBeenCalledWith(value);
    });
  });
});
