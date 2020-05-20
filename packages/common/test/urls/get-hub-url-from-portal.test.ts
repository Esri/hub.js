import { getHubUrlFromPortal } from '../../src/urls/get-hub-url-from-portal'
import { IPortal } from '@esri/arcgis-rest-portal';

describe("getHubUrlFromPortal", () => {
  let portalSelf: IPortal;
  beforeEach(() => {
    portalSelf = {
      id: 'fakeId',
      name: 'fakeName',
      isPortal: false,
      portalHostname: 'https://foo.com'
    } as IPortal;
  });

  it("returns undefined for non-AGO URLs", () => {
    portalSelf.isPortal = true;
    portalSelf.portalHostname = "some.portal.com";
    expect( () => { getHubUrlFromPortal(portalSelf) }).toThrow(new Error(`Hub Url is not available in ArcGIS Enterprise`));
  });

  it("can retrieve prod base url", () => {
    portalSelf.portalHostname = "something.maps.arcgis.com";
    expect(getHubUrlFromPortal(portalSelf)).toBe("https://hub.arcgis.com");
  });

  it("can retrieve qa base url", () => {
    portalSelf.portalHostname = "something.mapsqa.arcgis.com";
    expect(getHubUrlFromPortal(portalSelf)).toBe("https://hubqa.arcgis.com");
  });

  it("can retrieve dev base url", () => {
    portalSelf.portalHostname = "something.mapsdevext.arcgis.com";
    expect(getHubUrlFromPortal(portalSelf)).toBe("https://hubdev.arcgis.com");
  });

  it("can retrieve prod base url", () => {
    portalSelf.portalHostname = "www.arcgis.com";
    expect(getHubUrlFromPortal(portalSelf)).toBe("https://hub.arcgis.com");
  });

  it("can retrieve qa base url 2", () => {
    portalSelf.portalHostname = "qaext.arcgis.com";
    expect(getHubUrlFromPortal(portalSelf)).toBe("https://hubqa.arcgis.com");
  });

  it("can retrieve dev base url 2", () => {
    portalSelf.portalHostname = "devext.arcgis.com";
    expect(getHubUrlFromPortal(portalSelf)).toBe("https://hubdev.arcgis.com");
  });
});
