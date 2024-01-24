import { IModel } from "../../../src";
import { migrateBadBasemap } from "../../../src/sites/_internal/migrateBadBasemap";

describe("migrate bad basemaps:", () => {
  it("returns model if bad config not present", () => {
    const model: IModel = {
      data: {
        values: {
          map: {
            basemaps: {
              primary: {
                baseMapLayers: [],
                title: "title",
              },
            },
          },
        },
      },
    } as unknown as IModel;
    const chk = migrateBadBasemap(model);
    expect(chk).toBe(model);
  });

  it("returns clone without bad props, with updated  ", () => {
    const model: IModel = {
      data: {
        values: {
          map: {
            baseMapLayers: ["fake"],
            title: "fake title",
          },
        },
      },
    } as unknown as IModel;
    const chk = migrateBadBasemap(model);
    expect(chk).not.toBe(model);
    expect(chk?.data?.values.map.basemaps.primary.baseMapLayers).toEqual([
      "fake",
    ]);
    expect(chk?.data?.values.map.basemaps.primary.title).toEqual("fake title");
  });
  it("returns model wo either condition  ", () => {
    const model: IModel = {
      data: {
        values: {
          map: {
            title: "fake title",
          },
        },
      },
    } as unknown as IModel;
    const chk = migrateBadBasemap(model);
    expect(chk).toBe(model);
  });
});
