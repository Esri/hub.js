import { getLocationExtent } from "../../../../src/core/schemas/internal/getLocationExtent";
import { IHubProject } from "../../../../src/core/types/IHubProject";
import * as ExtentModule from "../../../../src/extent";
import { IHubRequestOptions } from "../../../../src/hub-types";

describe("getLocationExtent", () => {
  beforeEach(() => {
    spyOn(ExtentModule, "orgExtent").and.returnValue(
      Promise.resolve({
        xmin: -180,
        ymin: -90,
        xmax: 180,
        ymax: 90,
        spatialReference: {
          wkid: 4326,
        },
      })
    );
  });
  it("return entity location extent", async () => {
    const entity: IHubProject = {
      location: {
        extent: [
          [-170, -80],
          [170, 80],
        ],
      },
    } as unknown as IHubProject;
    const chk = await getLocationExtent(
      entity.location,
      {} as IHubRequestOptions
    );
    expect(chk).toEqual({
      xmin: -170,
      ymin: -80,
      xmax: 170,
      ymax: 80,
      spatialReference: {
        wkid: 4326,
      },
    });
  });
  it("return org extent", async () => {
    const entity: IHubProject = {
      location: {},
    } as unknown as IHubProject;
    const chk = await getLocationExtent(
      entity.location,
      {} as IHubRequestOptions
    );
    expect(chk).toEqual({
      xmin: -180,
      ymin: -90,
      xmax: 180,
      ymax: 90,
      spatialReference: {
        wkid: 4326,
      },
    });
  });
  it("return org extent if location undefined", async () => {
    const entity: IHubProject = {} as unknown as IHubProject;
    const chk = await getLocationExtent(
      entity.location,
      {} as IHubRequestOptions
    );
    expect(chk).toEqual({
      xmin: -180,
      ymin: -90,
      xmax: 180,
      ymax: 90,
      spatialReference: {
        wkid: 4326,
      },
    });
  });
});
