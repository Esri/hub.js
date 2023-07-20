import { IHubProject, IHubRequestOptions } from "../../../../src";
import { getLocationOptions } from "../../../../src/core/schemas/internal/getLocationOptions";
import * as ExtentModule from "../../../../src/extent";

describe("getLocationOptions:", () => {
  let orgExtentSpy: jasmine.Spy;
  beforeEach(() => {
    orgExtentSpy = spyOn(
      ExtentModule,
      "getGeographicOrgExtent"
    ).and.returnValue(
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
  it("custom is selected", async () => {
    const entity: IHubProject = {
      type: "Hub Project",
      location: {
        type: "custom",
      },
    } as IHubProject;

    const chk = await getLocationOptions(
      entity,
      "portalName",
      {} as IHubRequestOptions
    );

    expect(chk.length).toBe(3);
    expect(chk[2].selected).toBe(true);
  });
  it("none is selected", async () => {
    const entity: IHubProject = {
      type: "Hub Project",
    } as IHubProject;

    const chk = await getLocationOptions(
      entity,
      "portalName",
      {} as IHubRequestOptions
    );

    expect(chk.length).toBe(3);
    expect(chk[0].selected).toBe(true);
  });
  it("org is selected", async () => {
    const entity: IHubProject = {
      type: "Hub Project",
      location: {
        type: "org",
      },
    } as IHubProject;

    const chk = await getLocationOptions(
      entity,
      "portalName",
      {} as IHubRequestOptions
    );

    expect(chk.length).toBe(3);
    expect(chk[1].selected).toBe(true);
  });
  // it("custom is selected if no entity", async () => {
  //   const entity: IHubProject = {
  //     type: "Hub Project",
  //     location: {
  //       type: "org",
  //     },
  //   } as IHubProject;

  //   const chk = await getLocationOptions(
  //     null,
  //     "portalName",
  //     {} as IHubRequestOptions
  //   );

  //   expect(chk.length).toBe(3);
  //   expect(chk[2].selected).toBe(true);
  // });
});
