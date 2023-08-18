import { IHubContent, IHubProject, IHubRequestOptions } from "../../../../src";
import { ConfigurableEntity } from "../../../../src/core/schemas/internal/ConfigurableEntity";
import { getLocationOptions } from "../../../../src/core/schemas/internal/getLocationOptions";
import * as ExtentModule from "../../../../src/extent";

describe("getLocationOptions - default:", () => {
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
      id: "00c",
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
      id: "00c",
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
      id: "00c",
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
  it("custom is selected if entity does not have an id", async () => {
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
    expect(chk[2].selected).toBe(true);
  });
});

// Leaving this in for future work when we need
// dynamic options set for different entities

// describe("getLocationOptions - content:", () => {
//   it("custom is selected", async () => {
//     const entity: ConfigurableEntity = {
//       id: "00c",
//       type: "Hub Content",
//       location: {
//         type: "custom",
//       },
//       boundary: "item",
//       extent: [
//         [100, 100],
//         [120, 120],
//       ],
//     } as ConfigurableEntity;

//     const chk = await getLocationOptions(
//       entity,
//       "portalName",
//       {} as IHubRequestOptions
//     );

//     expect(chk.length).toBe(2);
//     expect(chk[1].selected).toBe(true);
//   });
//   it("none is selected", async () => {
//     const entity: ConfigurableEntity = {
//       id: "00c",
//       type: "Hub Content",
//       location: {
//         type: "none",
//       },
//       boundary: "none",
//     } as ConfigurableEntity;

//     const chk = await getLocationOptions(
//       entity,
//       "portalName",
//       {} as IHubRequestOptions
//     );

//     expect(chk.length).toBe(2);
//     expect(chk[0].selected).toBe(true);
//   });
//   it("custom is selected if entity does not have an id", async () => {
//     const entity: ConfigurableEntity = {
//       type: "Hub Content",
//       location: {
//         type: "custom",
//       },
//       boundary: "item",
//       extent: [
//         [100, 100],
//         [120, 120],
//       ],
//     } as ConfigurableEntity;

//     const chk = await getLocationOptions(
//       entity,
//       "portalName",
//       {} as IHubRequestOptions
//     );

//     expect(chk.length).toBe(2);
//     expect(chk[1].selected).toBe(true);
//   });
//   it("custom is selected & boundary is set", async () => {
//     const entity: ConfigurableEntity = {
//       id: "00c",
//       type: "Hub Content",
//       location: {
//         type: "custom",
//       },
//       boundary: "item",
//       extent: [
//         [100, 100],
//         [120, 120],
//       ],
//     } as ConfigurableEntity;

//     const chk = await getLocationOptions(
//       entity,
//       "portalName",
//       {} as IHubRequestOptions
//     );

//     expect(chk.length).toBe(2);
//     expect(chk[1].selected).toBe(true);
//   });
// });
