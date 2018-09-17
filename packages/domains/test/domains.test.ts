import { getHubUrl } from "../src/index";

describe("getHubUrl()", () => {
  it("should default to prod", done => {
    const url = getHubUrl();
    expect(url).toBe("https://hub.arcgis.com");
    done();
  });

  it("should convert a dev portal to hubdev", done => {
    // create a fake requestOptions
    const opts = {
      authentication: {
        portal: "https://dc.mapsdevext.arcgis.com",
        getToken(): Promise<string> {
          return Promise.resolve("fake");
        }
      }
    };
    const url = getHubUrl(opts);
    expect(url).toBe("https://hubdev.arcgis.com");
    done();
  });

  it("should convert a qa portal to hubdev", done => {
    // create a fake requestOptions
    const opts = {
      authentication: {
        portal: "https://dc.mapsqaext.arcgis.com",
        getToken(): Promise<string> {
          return Promise.resolve("fake");
        }
      }
    };
    const url = getHubUrl(opts);
    expect(url).toBe("https://hubqa.arcgis.com");
    done();
  });
});
