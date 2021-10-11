import { interpolateSite } from "../src";
import * as commonModule from "@esri/hub-common";

describe("interpolateSite", () => {
  it("Removes nested adlib templates before delegating to interpolate()", async () => {
    const interpolateSpy = spyOn(commonModule, "interpolate").and.returnValue({
      siteProperty: "propertyValue",
      data: { values: {} },
    });

    const template = {
      siteProperty: "propertyValue",
      data: {
        values: {
          dcatConfig: {
            legacyPropertyName: "legacyPropertyValue",
          },
        },
        feeds: {
          dcatUS11: {
            us11Prop: "us11Value",
          },
        },
      },
    };

    interpolateSite(template, {}, {});

    const expectedTemplate = {
      siteProperty: "propertyValue",
      data: { values: {} },
    };
    expect(interpolateSpy).toHaveBeenCalledWith(expectedTemplate, {}, {});
  });

  it("Re-attaches nested adlib templates to the return value", async () => {
    spyOn(commonModule, "interpolate").and.returnValue({
      siteProperty: "propertyValue",
      data: { values: {} },
    });

    const expectedTemplate = {
      siteProperty: "propertyValue",
      data: {
        values: {
          dcatConfig: {
            legacyPropertyName: "legacyPropertyValue",
          },
        },
        feeds: {
          dcatUS11: {
            us11Prop: "us11Value",
          },
        },
      },
    };

    const actualTemplate = interpolateSite(expectedTemplate, {}, {});
    expect(actualTemplate).toEqual(expectedTemplate);
  });

  it("Re-attaches nested adlib templates to the return value FAKE", async () => {
    spyOn(commonModule, "interpolate").and.returnValue({
      siteProperty: "propertyValue",
      data: { values: {} },
    });

    const expectedTemplate = {
      siteProperty: "propertyValue",
      data: {
        values: {},
      },
    };

    const actualTemplate = interpolateSite(expectedTemplate, {}, {});
    expect(actualTemplate).toEqual(expectedTemplate);
  });
});
